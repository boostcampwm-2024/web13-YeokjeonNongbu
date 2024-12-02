export const authQueries = {
  signUpQuery: 'INSERT INTO members (email, password, nickname) VALUES ($1, $2, $3) RETURNING *',
  findByEmailQuery:
    'SELECT member_id, email, password, nickname FROM members WHERE email = $1 LIMIT 1',
  updateInroduceQuery: 'UPDATE members SET introduce = $1 WHERE member_id = $2',
  updateNicknameQuery: 'UPDATE members SET nickname = $1 WHERE member_id = $2',
  createLottoColumnQuery: 'INSERT INTO lottos (member_id) VALUES ($1)',
  getIntroduceQuery: 'SELECT introduce FROM members WHERE member_id = $1'
};
