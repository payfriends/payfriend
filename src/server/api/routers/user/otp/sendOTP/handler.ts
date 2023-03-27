import { protectedProcedure } from "$/server/api/trpc";
import sendGridMail from "@sendgrid/mail";
import { env } from "$/env.mjs";
import { type MailDataRequired } from "@sendgrid/helpers/classes/mail";
import { DateTime } from "luxon";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

const sendOTP = protectedProcedure.mutation(async ({ ctx }) => {
  const isInSandBoxMode = env.SENDGRID_SANDBOX_MODE === "true";

  if (ctx.session.user.emailVerified != null) {
    throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
      "El correo electrónico ya está verificado"
    );
  }

  if (ctx.session.user.email == null) {
    throw CUSTOM_EXCEPTIONS.BAD_REQUEST();
  }

  const lastOTPQuery = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    select: {
      otpUpdatedAt: true,
    },
  });
  if (!lastOTPQuery) {
    throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró el usuario");
  }

  const { otpUpdatedAt } = lastOTPQuery;
  if (otpUpdatedAt != null && !isInSandBoxMode) {
    const now = new Date();
    const diff = Math.abs(now.getTime() - otpUpdatedAt.getTime());
    const minutes = Math.floor(diff / 1000 / 60);
    const hasFiveMinutesPassed = minutes >= 5;

    if (!hasFiveMinutesPassed) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "Ya solicitaste un código de verificación. Por favor espera unos minutos y vuelve a intentarlo."
      );
    }
  }

  const fourDigitGeneratedOTP = String(Math.floor(1000 + Math.random() * 9000));
  const msg: MailDataRequired = {
    to: ctx.session.user.email,
    from: env.SENDGRID_FROM_EMAIL,
    subject: "Código de verificación para tu cuenta de Deudamigo",
    text: `Tu código de verificación es: ${fourDigitGeneratedOTP}`,
    html: `<strong>Tu código de verificación es: ${fourDigitGeneratedOTP}</strong>`,
    mailSettings: {
      sandboxMode: {
        enable: isInSandBoxMode,
      },
    },
  };

  if (isInSandBoxMode) {
    console.log(
      `Se envió el código de verificación ${fourDigitGeneratedOTP} a ${ctx.session.user.email}`
    );
  }

  sendGridMail.setApiKey(env.SENDGRID_API_KEY);
  void sendGridMail.send(msg);

  await ctx.prisma.user.update({
    where: { id: ctx.session.user.id },
    data: {
      otp: fourDigitGeneratedOTP,
      otpUpdatedAt: DateTime.now().toUTC().toISO(),
    },
  });

  return true;
});

export default sendOTP;
