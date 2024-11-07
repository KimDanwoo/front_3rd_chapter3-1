import { fetchHolidays } from '@shared/api';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    // 3월의 공휴일 조회 (3.1절)
    const marchDate = new Date('2024-03-15');
    const marchHolidays = fetchHolidays(marchDate);

    expect(marchHolidays).toEqual({
      '2024-03-01': '삼일절',
    });

    // 5월의 공휴일 조회 (어린이날)
    const mayDate = new Date('2024-05-20');
    const mayHolidays = fetchHolidays(mayDate);

    expect(mayHolidays).toEqual({
      '2024-05-05': '어린이날',
    });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    // 4월은 공휴일이 없음
    const aprilDate = new Date('2024-04-15');
    const aprilHolidays = fetchHolidays(aprilDate);

    expect(aprilHolidays).toEqual({});

    // 7월도 공휴일이 없음
    const julyDate = new Date('2024-07-01');
    const julyHolidays = fetchHolidays(julyDate);

    expect(julyHolidays).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    // 2월의 공휴일 조회 (설날 연휴)
    const febDate = new Date('2024-02-15');
    const febHolidays = fetchHolidays(febDate);

    expect(febHolidays).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });

    // 9월의 공휴일 조회 (추석 연휴)
    const septDate = new Date('2024-09-01');
    const septHolidays = fetchHolidays(septDate);

    expect(septHolidays).toEqual({
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
    });
  });
});
