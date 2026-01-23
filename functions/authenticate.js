// Simple authentication middleware for admin functions
// For production, consider using Netlify Identity or another auth service

export const handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { ADMIN_PASSWORD } = process.env;

    console.log("Auth request received");
    console.log("ADMIN_PASSWORD exists:", !!ADMIN_PASSWORD);
    console.log("Request body:", event.body);

    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD not set in environment variables");
      throw new Error("Authentication not configured");
    }

    const { password } = JSON.parse(event.body);
    console.log("Password provided:", !!password);

    if (!password) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Password required" })
      };
    }

    // Simple password check
    // For production, use proper hashing (bcrypt, etc.)
    if (password === ADMIN_PASSWORD) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          success: true,
          message: "Authentication successful"
        })
      };
    } else {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          success: false,
          error: "Invalid password"
        })
      };
    }

  } catch (error) {
    console.error("❌ Authentication error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: error.message || "Authentication failed"
      })
    };
  }
};
