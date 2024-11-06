import { getTimeErrorMessage } from '../../utils/timeValidation';

interface TimeErrorResult {
  startTimeError: string | null;
  endTimeError: string | null;
}

interface ErrorMessages {
  startTime: string;
  endTime: string;
}

describe('getTimeErrorMessage >', () => {
  const ERROR_MESSAGES: ErrorMessages = {
    startTime: '시작 시간은 종료 시간보다 빨라야 합니다.',
    endTime: '종료 시간은 시작 시간보다 늦어야 합니다.',
  };

  const verifyErrorMessages = (result: TimeErrorResult, hasError: boolean): void => {
    if (hasError) {
      expect(result.startTimeError).toBe(ERROR_MESSAGES.startTime);
      expect(result.endTimeError).toBe(ERROR_MESSAGES.endTime);
    } else {
      expect(result.startTimeError).toBeNull();
      expect(result.endTimeError).toBeNull();
    }
  };

  describe('시간 유효성 검사 >', () => {
    it('시작 시간이 종료 시간보다 늦으면 에러 메시지를 반환한다', () => {
      const result = getTimeErrorMessage('15:00', '14:30');
      verifyErrorMessages(result, true);
    });

    it('시작 시간과 종료 시간이 같으면 에러 메시지를 반환한다', () => {
      const result = getTimeErrorMessage('15:00', '15:00');
      verifyErrorMessages(result, true);
    });
  });

  describe('빈 입력값 처리 >', () => {
    it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
      const result = getTimeErrorMessage('14:30', '15:00');
      verifyErrorMessages(result, false);
    });

    it('시작 시간이 비어있을 때 null을 반환한다', () => {
      const result = getTimeErrorMessage('', '15:00');
      verifyErrorMessages(result, false);
    });

    it('종료 시간이 비어있을 때 null을 반환한다', () => {
      const result = getTimeErrorMessage('15:00', '');
      verifyErrorMessages(result, false);
    });

    it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
      const result = getTimeErrorMessage('', '');
      verifyErrorMessages(result, false);
    });
  });
});
