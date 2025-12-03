/**
 * Gemini API Error Handler
 * Provides user-friendly Chinese error messages for common API errors
 */

export class GeminiAPIError extends Error {
  constructor(message, code, userMessage) {
    super(message);
    this.name = 'GeminiAPIError';
    this.code = code;
    this.userMessage = userMessage;
  }
}

/**
 * Parse and handle Gemini API errors
 * @param {Error} error - The error object from the API
 * @returns {GeminiAPIError} - An enhanced error with user-friendly message
 */
export const handleGeminiError = (error) => {
  console.error('[Gemini Error Handler]', error);

  // Extract error details
  const status = error?.status || error?.response?.status;
  const errorMessage = error?.message || '';
  const errorDetails = error?.response?.error?.message || '';

  // Check for specific error patterns
  if (errorMessage.includes('API Key not found') || errorMessage.includes('API key')) {
    return new GeminiAPIError(
      'API Key not found',
      'INVALID_API_KEY',
      '❌ API 金鑰錯誤\n\n請點擊右上角的設定按鈕，重新輸入有效的 Gemini API 金鑰。'
    );
  }

  // Handle by HTTP status code
  switch (status) {
    case 400:
      return new GeminiAPIError(
        'Bad Request',
        'BAD_REQUEST',
        '❌ 請求格式錯誤\n\n可能原因：\n• API 金鑰所在地區不支援免費版\n• 請求內容格式不正確\n\n建議：請檢查 API 金鑰設定。'
      );

    case 401:
      return new GeminiAPIError(
        'Unauthorized',
        'UNAUTHORIZED',
        '❌ 身份驗證失敗\n\nAPI 金鑰無效或已過期。\n請至設定重新輸入正確的金鑰。'
      );

    case 403:
      return new GeminiAPIError(
        'Forbidden',
        'FORBIDDEN',
        '❌ 權限不足\n\n您的 API 金鑰無權存取此功能。\n請檢查金鑰權限設定。'
      );

    case 429:
      // Check if it's a rate limit or quota issue
      if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorDetails.includes('quota')) {
        return new GeminiAPIError(
          'Resource Exhausted',
          'RATE_LIMIT_EXCEEDED',
          '⏱️ 使用額度已達上限\n\n您已達到 API 的請求限制或每日配額。\n\n解決方案：\n• 等待幾分鐘後重試\n• 升級至付費方案以提高額度\n• 檢查 Google AI Studio 的使用量'
        );
      }
      return new GeminiAPIError(
        'Too Many Requests',
        'TOO_MANY_REQUESTS',
        '⏱️ 請求過於頻繁\n\n請稍候片刻再試。'
      );

    case 500:
      return new GeminiAPIError(
        'Internal Server Error',
        'INTERNAL_SERVER_ERROR',
        '⚠️ 伺服器暫時出錯\n\nGoogle 伺服器發生問題。\n\n建議：\n• 稍候幾秒後重試\n• 嘗試切換其他 AI 模型（設定中）\n• 如持續發生，請稍後再試'
      );

    case 503:
      return new GeminiAPIError(
        'Service Unavailable',
        'SERVICE_UNAVAILABLE',
        '⚠️ 服務暫時無法使用\n\n伺服器可能正在維護或負載過高。\n請稍後再試。'
      );

    case 504:
      return new GeminiAPIError(
        'Deadline Exceeded',
        'DEADLINE_EXCEEDED',
        '⏰ 處理超時\n\n請求處理時間過長。\n建議縮短故事長度或重試。'
      );

    default:
      // Generic error
      return new GeminiAPIError(
        error.message || 'Unknown error',
        'UNKNOWN_ERROR',
        `❌ 發生未知錯誤\n\n${errorMessage || '請檢查網路連線或稍後再試。'}\n\n如問題持續，請嘗試：\n• 重新整理頁面\n• 檢查 API 金鑰設定\n• 查看瀏覽器控制台的詳細錯誤訊息`
      );
  }
};
