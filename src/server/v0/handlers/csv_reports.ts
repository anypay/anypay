
import moment from 'moment';
import * as Joi from 'joi';
import * as Boom from '@hapi/boom';

import { buildAccountCsvReport, buildReportCsvFromDates } from '@/lib/csv';

import prisma from '@/lib/prisma';
import { Server } from '@hapi/hapi';

export async function accountCSVReports(server: Server) {

  server.route({
    method: 'GET',
    path: '/csv_reports.csv',
    handler: async (req, h) => {

      const token = await prisma.access_tokens.findFirst({
        where: {
          uid: req.query.token
        }
      })

      if (!token) {

        return Boom.unauthorized('invalid access token');
      }

      let start_date = moment(req.query.start_date).startOf('day');
      let end_date = moment(req.query.end_date).startOf('day').add(1, 'day');

      let content = await buildReportCsvFromDates(
        token.account_id,
        start_date.toDate(),
        end_date.toDate()
      );

      let start_formatted = start_date.format('MM-DD-YYYY');
      let end_formatted = end_date.subtract(1, 'day').format('MM-DD-YYYY');

      let filename = `anypay_report_${start_formatted}_${end_formatted}.csv`

      let response = h.response(content)
        .header("Content-Disposition", `attachment;filename="${filename}"`)
        .header("Content-Type", 'text/csv');

      return response;

    },
    options: {
      tags: ['v0', 'csv'],
      validate: {
        query: Joi.object({
          start_date: Joi.date().required(),
          end_date: Joi.date().required(),
          token: Joi.string().required()
        })
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/reports/csv/payments.csv',
    handler: async (req, h) => {

      const token = await prisma.access_tokens.findFirst({
        where: {
          uid: req.query.token
        }
      })

      if (!token) {

        return Boom.unauthorized('invalid access token');
      }

      const account = await prisma.accounts.findFirstOrThrow({
        where: {
          id: token.account_id
        }
      })

      let content = await buildAccountCsvReport(account)

      let filename = `anypay_payments_report_complete.csv`

      let response = h.response(content)
        .header("Content-Disposition", `attachment;filename="${filename}"`)
        .header("Content-Type", 'text/csv');

      return response;

    },
    options: {
      tags: ['v0', 'csv'],
      validate: {
        query: Joi.object({
          token: Joi.string().required()
        })
      }
    }
  });

}

