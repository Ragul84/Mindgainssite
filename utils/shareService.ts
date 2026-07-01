import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Platform } from 'react-native';
import HapticService from './hapticService';

export default class ShareService {
  /**
   * Generates a deep link for a specific quiz
   */
  static getQuizLink(quizId: string) {
    // Generates a link like: mindgains://quiz-hub/join?id=123
    return Linking.createURL('quiz-hub/join', {
      queryParams: { id: quizId },
    });
  }

  /**
   * Shares a quiz using the native sharing dialog
   */
  static async shareQuiz(quizId: string, title: string, prizePool?: string) {
    const url = this.getQuizLink(quizId);
    const prizeText = prizePool ? ` with a prize pool of ${prizePool} coins!` : '!';
    const message = `🔥 Challenge Alert! Join my quiz "${title}" on Raavan${prizeText}\n\nEnter now: ${url}`;

    try {
      if (await Sharing.isAvailableAsync()) {
        HapticService.selection();
        await Sharing.shareAsync(url, {
          dialogTitle: `Share ${title}`,
          UTI: 'public.plain-text',
          mimeType: 'text/plain',
        });
      } else {
        // Fallback to clipboard
        await this.copyToClipboard(url, 'Link copied! Native sharing is unavailable.');
      }
    } catch (error) {
      console.error('Error sharing quiz:', error);
      await this.copyToClipboard(url, 'Error sharing. Link copied to clipboard.');
    }
  }

  /**
   * Copies text to clipboard with haptic feedback
   */
  static async copyToClipboard(text: string, toastMessage?: string) {
    await Clipboard.setStringAsync(text);
    HapticService.notification('success');
    if (toastMessage) {
      alert(toastMessage);
    }
  }
}
