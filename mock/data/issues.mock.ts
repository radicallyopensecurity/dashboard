import { buildIssue } from './issues-base.mock'

export const issuesMock = [
  buildIssue(
    1,
    'Man-in-the-middle attack',
    `The organization's network was found to be compromised by a man-in-the-middle attack, allowing the attacker to intercept and modify network traffic between two endpoints.\n\n![image](/uploads/673aefc37c61cf082820cb6f17acbbb6/image.png)`,
    '2024-05-31T15:57:44.513Z',
    'Moderate'
  ),
  buildIssue(
    2,
    'SQL Injection',
    'The contact form is vulnerable to SQL injection and as a result can retrieve sensitive information from the DB.',
    '2024-04-28T23:54:52.792Z',
    'High'
  ),
  buildIssue(
    3,
    'Reusing Cookie',
    'Penetration testers have identified several findings related to the reuse of cookies. These findings highlight the potential security risks associated with the reuse of cookies on websites and applications.',
    '2024-04-28T23:54:52.792Z',
    'non-finding'
  ),
  buildIssue(
    4,
    'Info Leak - LOW',
    'Info Leak',
    '2024-04-28T23:54:52.792Z',
    'finding'
  ),
  buildIssue(
    5,
    'libgnunetchat: Chats and/or group channels can be flooded',
    'It is possible to flood chats and (group) channels using a dedicated controller script, or custom C program.',
    '2024-04-28T23:54:52.792Z',
    'Low'
  ),
  buildIssue(
    6,
    'Hello Redacted',
    'Just showing something to @pentext',
    '2024-04-28T23:54:52.792Z',
    'finding'
  ),
  buildIssue(
    7,
    `XSS vulnerability in the application's user input field`,
    `Our pen testing team conducted an assessment on the web application hosted by XYZ Corp.\n\nDuring the assessment, we discovered an XSS vulnerability in the application's user input field. This vulnerability could allow an attacker to execute malicious code and steal sensitive user data.\n\nWe strongly recommend immediate remediation of this issue to prevent any potential exploitation.`,
    '2024-04-28T23:54:52.792Z',
    'Extreme'
  ),
  buildIssue(
    8,
    'DDOS protection',
    'In the future you could do xyz',
    '2024-04-28T23:54:52.792Z',
    'other'
  ),
]
