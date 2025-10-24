import {
  LeetCodeUser,
  LeetCodeSubmission,
  LeetCodeProfile,
} from "../types/leetcode";

export class LeetCodeAPI {
  private static readonly GRAPHQL_URL = "https://leetcode.com/graphql/";
  private static readonly USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

  /**
   * Get user profile and statistics from LeetCode
   */
  static async getUserProfile(
    username: string,
  ): Promise<LeetCodeProfile | null> {
    try {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
              reputation
            }
          }
        }
      `;

      const response = await fetch(this.GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": this.USER_AGENT,
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error("GraphQL errors:", data.errors);
        return null;
      }

      const user = data.data?.matchedUser;
      if (!user) {
        return null;
      }

      // Calculate totals from submission stats
      const stats = user.submitStats.acSubmissionNum;
      const easySolved =
        stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
      const mediumSolved =
        stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
      const hardSolved =
        stats.find((s: any) => s.difficulty === "Hard")?.count || 0;
      const totalSolved = easySolved + mediumSolved + hardSolved;
      const totalSubmissions = stats.reduce(
        (sum: number, s: any) => sum + s.submissions,
        0,
      );

      return {
        username: user.username,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        totalSubmissions,
        ranking: user.profile?.ranking || 0,
        reputation: user.profile?.reputation || 0,
      };
    } catch (error) {
      console.error("Error fetching LeetCode profile:", error);
      return null;
    }
  }

  /**
   * Get recent submissions from LeetCode
   */
  static async getRecentSubmissions(
    username: string,
    limit: number = 50,
  ): Promise<LeetCodeSubmission[]> {
    try {
      const query = `
        query getRecentSubmissions($username: String!, $limit: Int!) {
          recentSubmissionList(username: $username, limit: $limit) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
          }
        }
      `;

      const response = await fetch(this.GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": this.USER_AGENT,
        },
        body: JSON.stringify({
          query,
          variables: { username, limit },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error("GraphQL errors:", data.errors);
        return [];
      }

      return data.data?.recentSubmissionList || [];
    } catch (error) {
      console.error("Error fetching recent submissions:", error);
      return [];
    }
  }

  /**
   * Check if user has solved any problem today
   */
  static async hasSolvedToday(username: string): Promise<boolean> {
    try {
      const submissions = await this.getRecentSubmissions(username, 20);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return submissions.some((submission) => {
        const submissionDate = new Date(parseInt(submission.timestamp) * 1000);
        submissionDate.setHours(0, 0, 0, 0);

        return (
          submissionDate.getTime() === today.getTime() &&
          submission.statusDisplay === "Accepted"
        );
      });
    } catch (error) {
      console.error("Error checking if user solved today:", error);
      return false;
    }
  }

  /**
   * Get submissions from today
   */
  static async getTodaySubmissions(
    username: string,
  ): Promise<LeetCodeSubmission[]> {
    try {
      const submissions = await this.getRecentSubmissions(username, 50);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return submissions.filter((submission) => {
        const submissionDate = new Date(parseInt(submission.timestamp) * 1000);
        submissionDate.setHours(0, 0, 0, 0);

        return submissionDate.getTime() === today.getTime();
      });
    } catch (error) {
      console.error("Error fetching today's submissions:", error);
      return [];
    }
  }

  /**
   * Validate if a LeetCode username exists
   */
  static async validateUsername(username: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(username);
      return profile !== null;
    } catch (error) {
      console.error("Error validating username:", error);
      return false;
    }
  }
}
