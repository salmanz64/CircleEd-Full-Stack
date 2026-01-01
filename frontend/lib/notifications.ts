// Helper functions for dispatching notifications

export interface NotificationPayload {
  type: "session_accepted" | "session_completed" | "tokens_earned" | "session_rejected"
  title: string
  message: string
  data?: {
    sessionId?: number
    tokens?: number
    skillName?: string
    teacherName?: string
  }
}

export function sendNotification(payload: NotificationPayload) {
  const event = new CustomEvent('notification', { detail: payload })
  window.dispatchEvent(event)
}

export function sendSessionAcceptedNotification(skillName: string, teacherName?: string, sessionId?: number) {
  sendNotification({
    type: 'session_accepted',
    title: 'Session Accepted',
    message: `Your session for "${skillName}" has been accepted${teacherName ? ` by ${teacherName}` : ''}.`,
    data: { sessionId, skillName }
  })
}

export function sendSessionRejectedNotification(skillName: string, sessionId?: number) {
  sendNotification({
    type: 'session_rejected',
    title: 'Session Declined',
    message: `Your session request for "${skillName}" has been declined. Tokens have been refunded.`,
    data: { sessionId, skillName }
  })
}

export function sendSessionCompletedNotification(skillName: string, sessionId?: number) {
  sendNotification({
    type: 'session_completed',
    title: 'Session Completed',
    message: `Your session for "${skillName}" has been marked as complete.`,
    data: { sessionId, skillName }
  })
}

export function sendTokensEarnedNotification(tokens: number, skillName: string, sessionId?: number) {
  sendNotification({
    type: 'tokens_earned',
    title: 'Tokens Earned',
    message: `You earned ${tokens} tokens from teaching "${skillName}".`,
    data: { sessionId, tokens, skillName }
  })
}
