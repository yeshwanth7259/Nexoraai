export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  link?: string;
}

export class NotificationService {
  /**
   * Pushes a real-time notification to the user via Supabase Realtime/DB
   */
  static async notifyUser(payload: NotificationPayload) {
    console.log(`[Notification] To User ${payload.userId}: [${payload.type}] ${payload.title} - ${payload.message}`);
    
    // Implementation for inserting into public.notifications table
    // which the frontend subscribes to via Supabase Realtime
  }
}
