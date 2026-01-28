import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async classifyTicket(title: string, description: string): Promise<{ priority: string; tags: string[] }> {
    try {
      const prompt = `
        Analyze the following IT support ticket and classify it.
        Return ONLY a JSON object with "priority" (LOW, MEDIUM, HIGH, CRITICAL) and "tags" (array of strings, max 3).
        
        Title: ${title}
        Description: ${description}
        
        Response Format:
        {"priority": "HIGH", "tags": ["network", "wifi"]}
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Clean up markdown code blocks if present
      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("AI Classification Error:", error);
      return { priority: "MEDIUM", tags: ["unclassified"] }; // Fallback
    }
  }

  async generateAutoReply(ticketId: string, context: string): Promise<string> {
    // TODO: Implementation for RAG-based auto-reply
    return "This is an automated acknowledgment. A technician will review your request shortly.";
  }
}

export const aiService = new GeminiService();
