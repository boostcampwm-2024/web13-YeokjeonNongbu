export const mailQueries = {
  checkUnreadQuery:
    'SELECT EXISTS (SELECT 1 FROM mails WHERE member_id = $1 AND read_status = false LIMIT 1) AS result',
  makeReadedQuery: 'UPDATE mails SET read_status=true WHERE member_id = $1',
  getAllMailQuery:
    'SELECT mail_id, action, param1, param2, param3, content, created_at, read_status FROM mails WHERE member_id = $1 ORDER BY mail_id DESC LIMIT 50',
  deleteMailQuery: 'DELETE FROM mails WHERE member_id = $1',
  getMemberQuery: 'SELECT EXISTS (SELECT 1 FROM mails WHERE member_id = $1) AS result',
  getCropName: 'SELECT crop_name	FROM public.crops WHERE crop_id = $1',
  getMemberNickNameByMemberID: 'SELECT nickname FROM members WHERE member_id = $1',
  InsertMailQuery:
    'INSERT INTO public.mails(member_id, action, param1, param2, param3, content) VALUES ($1, $2, $3, $4, $5, $6);'
};
