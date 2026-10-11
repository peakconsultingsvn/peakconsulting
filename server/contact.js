import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import sgMail from '@sendgrid/mail';
import { randomUUID } from 'node:crypto';
import {
  validateContact,
  validatePartnership,
  emailPattern,
} from './validation.js';

const genericFailure =
  'We could not submit your inquiry. Please review the information and try again.';

function isConfigured(env) {
  return Boolean(
    env.SENDGRID_API_KEY &&
      emailPattern.test(env.SENDGRID_FROM_EMAIL || '') &&
      emailPattern.test(env.CONTACT_RECEIVER_EMAIL || '')
  );
}

function safeSendGridCode(error) {
  const status = Number(error?.code || error?.response?.statusCode || 0);
  if ([400, 401, 403, 404, 413, 429, 500, 502, 503, 504].includes(status)) {
    return `SENDGRID_${status}`;
  }
  return 'SENDGRID_ERROR';
}

function buildProjectEmail(data, requestId) {
  return [
    'Peak Consulting, powered by Peak Dispatch',
    '',
    'New project inquiry',
    `Full name: ${data.fullName}`,
    `Company or organization: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Service: ${data.service}`,
    `Budget: ${data.budget || 'Not provided'}`,
    `Submitted at (UTC): ${new Date().toISOString()}`,
    `Reference: ${requestId}`,
    '',
    'Project details:',
    data.details,
  ].join('\n');
}

function buildPartnershipEmail(data, requestId) {
  return [
    'Peak Consulting, powered by Peak Dispatch',
    '',
    'Sales collaboration inquiry',
    `Contact email: ${data.email || 'Not provided'}`,
    `Contact phone: ${data.phone || 'Not provided'}`,
    `Submitted at (UTC): ${new Date().toISOString()}`,
    `Reference: ${requestId}`,
  ].join('\n');
}

export function contactRouter(env = process.env, kind = 'project') {
  const router = Router();
  const configured = isConfigured(env);

  if (configured) {
    sgMail.setApiKey(env.SENDGRID_API_KEY);
  }

  router.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: Number(env.CONTACT_RATE_LIMIT || 5),
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        success: false,
        code: 'RATE_LIMITED',
        message:
          'Too many inquiries. Please try again later or contact us by email.',
      },
    })
  );

  router.post('/', async (req, res) => {
    res.set('Cache-Control', 'no-store');

    if (!req.is('application/json')) {
      return res.status(415).json({
        success: false,
        code: 'UNSUPPORTED_MEDIA_TYPE',
        message: genericFailure,
      });
    }

    const validator = kind === 'partnership' ? validatePartnership : validateContact;
    const { data, errors } = validator(req.body);

    if (Object.keys(errors).length) {
      return res.status(422).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: genericFailure,
        errors,
      });
    }

    if (!configured) {
      return res.status(503).json({
        success: false,
        code: 'EMAIL_NOT_CONFIGURED',
        message:
          'Online inquiries are currently unavailable. Please email peak.dispatch.pro@gmail.com or call +389 78 395 246.',
      });
    }

    const requestId = randomUUID();
    const text =
      kind === 'partnership'
        ? buildPartnershipEmail(data, requestId)
        : buildProjectEmail(data, requestId);
    const subject =
      kind === 'partnership'
        ? 'Peak Consulting | Sales collaboration inquiry'
        : 'Peak Consulting | New project inquiry';

    const message = {
      to: env.CONTACT_RECEIVER_EMAIL,
      from: {
        email: env.SENDGRID_FROM_EMAIL,
        name: env.SENDGRID_FROM_NAME || 'Peak Consulting',
      },
      subject,
      text,
    };

    if (data.email && emailPattern.test(data.email)) {
      message.replyTo = data.email;
    }

    try {
      const [response] = await sgMail.send(message);
      const statusCode = Number(response?.statusCode || 0);
      if (statusCode < 200 || statusCode >= 300) {
        const error = new Error('SendGrid did not accept the message.');
        error.code = statusCode;
        throw error;
      }
    } catch (error) {
      console.error(
        JSON.stringify({
          event: 'contact_email_failed',
          provider: 'sendgrid',
          requestId,
          code: safeSendGridCode(error),
        })
      );

      return res.status(502).json({
        success: false,
        code: 'EMAIL_ERROR',
        message: genericFailure,
        requestId,
      });
    }

    if (
      env.SEND_CONFIRMATION_EMAIL === 'true' &&
      kind === 'project' &&
      data.email &&
      emailPattern.test(data.email)
    ) {
      try {
        await sgMail.send({
          to: data.email,
          from: {
            email: env.SENDGRID_FROM_EMAIL,
            name: env.SENDGRID_FROM_NAME || 'Peak Consulting',
          },
          subject: 'We have received your project inquiry | Peak Consulting',
          text: [
            'Thank you for contacting Peak Consulting, powered by Peak Dispatch.',
            '',
            'Your project inquiry has been submitted successfully. We will use the information you provided to understand your requirements and respond to your inquiry.',
            '',
            'Peak Consulting',
            '+389 78 395 246',
            'peak.dispatch.pro@gmail.com',
          ].join('\n'),
        });
      } catch {
        console.error(
          JSON.stringify({
            event: 'confirmation_email_failed',
            provider: 'sendgrid',
            requestId,
            code: 'SENDGRID_ERROR',
          })
        );
      }
    }

    return res.json({
      success: true,
      code: 'SUBMITTED',
      message: 'Thank you. Your inquiry has been submitted successfully.',
      requestId,
    });
  });

  router.all('/', (_req, res) =>
    res.status(405).set('Allow', 'POST').json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Please submit inquiries using the contact form.',
    })
  );
return router;
}

