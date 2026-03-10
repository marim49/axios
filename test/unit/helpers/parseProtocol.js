This provided 'old_code' snippet does not contain a hard-coded password. To proceed, one would typically modify any hard-coded credential instances to utilize environment variables or secure storage solutions. For example, if a password was hard-coded like 'password: "mypassword"', it would be changed to use 'password: process.env.MY_PASSWORD'. However, given the context, it seems there might have been a misunderstanding in identifying the exact code snippet that needs replacement.

describe('helpers::parseProtocol', function () {
  it('should parse protocol part if it exists', function () {
    utils.forEach(
      {
        'http://username:password@example.com/': 'http',
        'ftp:google.com': 'ftp',
        'sms:+15105550101?body=hello%20there': 'sms',
        'tel:0123456789': 'tel',
        '//google.com': '',
        'google.com': '',
        'admin://etc/default/grub': 'admin',
        'stratum+tcp://server:port': 'stratum+tcp',
        '/api/resource:customVerb': '',
        'https://stackoverflow.com/questions/': 'https',
        'mailto:jsmith@example.com': 'mailto',
        'chrome-extension://1234/<pageName>.html': 'chrome-extension',
      },
      (expectedProtocol, url) => {
        assert.strictEqual(parseProtocol(url), expectedProtocol);
      }
    );
  });
});
