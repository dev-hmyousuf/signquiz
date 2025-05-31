import { Client, Account, Databases, ID, Query, Storage, Models, Avatars } from "appwrite";

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('683ab8f80035f2e3d9fa'); // Replace with your actual project ID

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

// Database and collection constants
export const DATABASE_ID = '683ab94e002131d45172';
export const USERS_COLLECTION_ID = '683ab9e5001ce81f53b9';
export const EVENTS_COLLECTION_ID = '683abd21001198892ae3';
export const QUIZZES_COLLECTION_ID = '683abccc0030b38969e4';
export const QUESTIONS_COLLECTION_ID = '683abc3b0034df38492a';
export const ANSWERS_COLLECTION_ID = '683aba8a002009e07627';
export const LEADERBOARDS_COLLECTION_ID = '683abaff0022c8fa991a';

// Helper functions for common database operations
export async function createUser(clerkId: string, email: string, username: string) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        clerkId,
        email,
        username,
        xp: 0,
        badges: [],
        joinedAt: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("clerkId", clerkId)]
    );
    
    return response.documents[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUserByUsername(username: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("username", username)]
    );
    
    return response.documents[0];
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

export async function updateUserXP(userId: string, xpToAdd: number) {
  try {
    const user = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    );
    
    const currentXP = user.xp || 0;
    
    return await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      {
        xp: currentXP + xpToAdd
      }
    );
  } catch (error) {
    console.error("Error updating user XP:", error);
    throw error;
  }
}

export async function addUserBadge(userId: string, badge: string) {
  try {
    const user = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    );
    
    const currentBadges = user.badges || [];
    
    if (!currentBadges.includes(badge)) {
      currentBadges.push(badge);
      
      return await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          badges: currentBadges
        }
      );
    }
    
    return user;
  } catch (error) {
    console.error("Error adding user badge:", error);
    throw error;
  }
}

export async function getUpcomingEvents(limit = 10) {
  try {
    const now = new Date().toISOString();
    
    return await databases.listDocuments(
      DATABASE_ID,
      EVENTS_COLLECTION_ID,
      [
        Query.greaterThan("startTime", now),
        Query.limit(limit)
      ]
    );
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
}

export async function getActiveEvents(limit = 10) {
  try {
    const now = new Date().toISOString();
    
    return await databases.listDocuments(
      DATABASE_ID,
      EVENTS_COLLECTION_ID,
      [
        Query.lessThanEqual("startTime", now),
        Query.greaterThan("endTime", now),
        Query.limit(limit)
      ]
    );
  } catch (error) {
    console.error("Error fetching active events:", error);
    throw error;
  }
}

export async function getEventById(eventId: string) {
  try {
    return await databases.getDocument(
      DATABASE_ID,
      EVENTS_COLLECTION_ID,
      eventId
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

export async function getQuizByEventId(eventId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      QUIZZES_COLLECTION_ID,
      [Query.equal("eventId", eventId)]
    );
    
    return response.documents[0];
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
}

export async function getQuizQuestions(quizId: string) {
  try {
    return await databases.listDocuments(
      DATABASE_ID,
      QUESTIONS_COLLECTION_ID,
      [
        Query.equal("quizId", quizId),
        Query.orderAsc("order")
      ]
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

export async function submitAnswer(userId: string, questionId: string, answerId: string, timeSpent: number) {
  try {
    const question = await databases.getDocument(
      DATABASE_ID,
      QUESTIONS_COLLECTION_ID,
      questionId
    );
    
    const isCorrect = question.correctOptionId === answerId;
    
    return await databases.createDocument(
      DATABASE_ID,
      ANSWERS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        questionId,
        answerId,
        timeSpent,
        isCorrect,
        submittedAt: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
}

export async function getEventLeaderboard(eventId: string) {
  try {
    return await databases.listDocuments(
      DATABASE_ID,
      LEADERBOARDS_COLLECTION_ID,
      [
        Query.equal("eventId", eventId),
        Query.orderDesc("score"),
        Query.limit(100)
      ]
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

export async function updateLeaderboard(eventId: string, userId: string, score: number, correctAnswers: number, totalQuestions: number) {
  try {
    const existingEntries = await databases.listDocuments(
      DATABASE_ID,
      LEADERBOARDS_COLLECTION_ID,
      [
        Query.equal("eventId", eventId),
        Query.equal("userId", userId)
      ]
    );
    
    if (existingEntries.documents.length > 0) {
      const existingEntry = existingEntries.documents[0];
      
      return await databases.updateDocument(
        DATABASE_ID,
        LEADERBOARDS_COLLECTION_ID,
        existingEntry.$id,
        {
          score,
          correctAnswers,
          totalQuestions,
          updatedAt: new Date().toISOString()
        }
      );
    } else {
      return await databases.createDocument(
        DATABASE_ID,
        LEADERBOARDS_COLLECTION_ID,
        ID.unique(),
        {
          eventId,
          userId,
          score,
          correctAnswers,
          totalQuestions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
    }
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    throw error;
  }
}

export async function createEvent(title: string, description: string, startTime: string, endTime: string, imageUrl: string = "") {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      EVENTS_COLLECTION_ID,
      ID.unique(),
      {
        title,
        description,
        startTime,
        endTime,
        imageUrl,
        createdAt: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function createQuiz(eventId: string, title: string, description: string, timeLimit: number) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      QUIZZES_COLLECTION_ID,
      ID.unique(),
      {
        eventId,
        title,
        description,
        timeLimit,
        createdAt: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}

export async function addQuestion(
  quizId: string, 
  questionText: string, 
  options: {id: string, text: string}[], 
  correctOptionId: string,
  timeLimit: number,
  order: number
) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      QUESTIONS_COLLECTION_ID,
      ID.unique(),
      {
        quizId,
        questionText,
        options,
        correctOptionId,
        timeLimit,
        order,
        createdAt: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
}

// Subscribe to real-time updates
export function subscribeToEvent(eventId: string, callback: (payload: any) => void) {
  return client.subscribe([`databases.${DATABASE_ID}.collections.${EVENTS_COLLECTION_ID}.documents.${eventId}`], callback);
}

export function subscribeToLeaderboard(eventId: string, callback: (payload: any) => void) {
  return client.subscribe([`databases.${DATABASE_ID}.collections.${LEADERBOARDS_COLLECTION_ID}.documents`], 
    (response) => {
      if (response.payload.eventId === eventId) {
        callback(response);
      }
    }
  );
}