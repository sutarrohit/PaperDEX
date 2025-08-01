export const resetPasswordTemplate = (url: string, name?: string) => {
    return `
  <!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Reset your password</title>
    <style type="text/css" rel="stylesheet" media="all">
      *:not(br):not(tr):not(html) {
        font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        line-height: 1.4;
        background-color: #F5F7F9;
        color: #839197;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #414EF9;
      }
      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #F5F7F9;
      }
      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .email-masthead {
        padding: 25px 0;
        text-align: center;
      }
      .email-masthead_name {
        font-size: 16px;
        font-weight: bold;
        color: #839197;
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }
      .email-body {
        width: 100%;
        margin: 0;
        padding: 0;
        border-top: 1px solid #E7EAEC;
        border-bottom: 1px solid #E7EAEC;
        background-color: #FFFFFF;
      }
      .email-body_inner {
        width: 570px;
        margin: 0 auto;
        padding: 0;
      }
      .email-footer {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        text-align: center;
      }
      .email-footer p {
        color: #839197;
      }
      .body-action {
        width: 100%;
        margin: 30px auto;
        padding: 0;
        text-align: center;
      }
      .body-sub {
        margin-top: 25px;
        padding-top: 25px;
        border-top: 1px solid #E7EAEC;
      }
      .content-cell {
        padding: 35px;
      }
      h1 {
        margin-top: 0;
        color: #292E31;
        font-size: 19px;
        font-weight: bold;
        text-align: left;
      }
      p {
        margin-top: 0;
        color: #839197;
        font-size: 16px;
        line-height: 1.5em;
        text-align: left;
      }
      p.sub {
        font-size: 12px;
      }
      p.center {
        text-align: center;
      }
      .button {
        display: inline-block;
        width: 200px;
        background-color: #414EF9;
        border-radius: 3px;
        color: #ffffff;
        font-size: 15px;
        line-height: 45px;
        text-align: center;
        text-decoration: none;
        -webkit-text-size-adjust: none;
        mso-hide: all;
      }
      @media only screen and (max-width: 600px) {
        .email-body_inner,
        .email-footer {
          width: 100% !important;
        }
      }
      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="email-masthead">
                <a class="email-masthead_name">PaperDEX</a>
              </td>
            </tr>
            <tr>
              <td class="email-body" width="100%">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-cell">
                      <p>Hi ${name ?? "there"},</p>
                      <p>We received a request to reset your password. Click the button below to set a new password.</p>
                      <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <div>
                              <a href="${url}" style="display: inline-block; width: 200px; background-color: #414EF9; border-radius: 3px; color: #ffffff; font-family: sans-serif; font-size: 15px; line-height: 45px; text-align: center; text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;" class="button">Reset Password</a>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <p>If you didn’t request a password reset, you can safely ignore this email.</p>
                      <p>Thanks,<br>The PaperDEX Team</p>
                      <table class="body-sub">
                        <tr>
                          <td>
                            <p class="sub">If you’re having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
                            <p class="sub"><a href="${url}">${url}</a></p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-cell">
                      <p class="sub center">
                        PaperDEX Labs.<br />
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
