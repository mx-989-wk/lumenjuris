export const templateTwoFactor = (code: string, username?: string) => {
  return `
        <tr>
            <td style="padding:30px; font-family: Arial, sans-serif; color:#1f2937;">

                <h2 style="margin-top:0; margin-bottom:10px;">Bonjour <strong>${username}</strong>.</h2>

                <p style="font-size:14px; line-height:1.6;">
                    Voici votre code de vérification pour accéder à votre compte Lumen Juris.<br/>
                    Saisissez ce code dans l'application pour confirmer votre identité.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:30px 0; width:100%;">
                    <tr>
                        <td align="center">
                            <div style="display:inline-block; background-color:#f3f4f6; border:2px solid #716af9;
                                        border-radius:8px; padding:16px 32px;">
                                <span style="font-size:36px; font-weight:bold; letter-spacing:8px; color:#111827;
                                             font-family:'Courier New', monospace;">
                                    ${code}
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>

                <p style="font-size:13px; color:#6b7280;">
                    Ce code est valide pendant <strong>15 minutes</strong>. Passé ce délai, vous devrez en demander un nouveau.
                </p>

                <p style="font-size:13px; color:#6b7280;">
                    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email et sécurisez votre compte.
                </p>

            </td>
        </tr>
    `;
};
