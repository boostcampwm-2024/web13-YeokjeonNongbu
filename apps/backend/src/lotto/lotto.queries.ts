export const lottoQueries = {
  getMemberCash: 'SELECT available_cash FROM members WHERE member_id = $1',
  setMemberCash: 'UPDATE members SET available_cash = $1 WHERE member_id = $2',
  startLottoCount: 'INSERT INTO lottos (member_id) VALUES ($1)',
  findLottoHistory:
    'SELECT member_id, first_count, second_count, third_count, fourth_count, fifth_count FROM lottos WHERE member_id = $1',
  getRemainTickets:
    'SELECT inning_id, first_count, second_count, third_count, fourth_count, fifth_count FROM inning ORDER BY inning_id DESC LIMIT 1',
  insertNewTickets: 'INSERT INTO inning DEFAULT VALUES'
};
