
import * as moment from 'moment';
import * as Joi from 'joi';
import * as Boom from 'boom';

import { buildReportCsvFromDates, buildAllTimeReport } from '../../../lib/wire';
import { models } from '../../../lib';

export async function accountCSVReports(server) {

  server.route({
    method: 'GET',
    path: '/csv_reports.csv',
    handler: async (req, h) => {

      let token = await models.AccessToken.findOne({ where: {

        uid: req.query.token

      }});

      if (!token) {

        return Boom.unauthorized('invalid access token');
      }

      let start_date = moment(req.query.start_date).startOf('day');
      let end_date = moment(req.query.end_date).startOf('day').add(1, 'day');

      let content = await buildReportCsvFromDates(
        token.account_id,
        start_date,
        end_date
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
      tags: ['api'],
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
    path: '/complete_history.csv',
    handler: async (req, h) => {

      try {

        let token = await models.AccessToken.findOne({ where: {

          uid: req.query.token

        }});

        if (!token) {

          return Boom.unauthorized('invalid access token');
        }

        let content = await buildAllTimeReport(token.account_id);

        let filename = `anypay_report_complete.csv`

        let response = h.response(content)
          .header("Content-Disposition", `attachment;filename="${filename}"`)
          .header("Content-Type", 'text/csv');

        return response;

      } catch(error) {

        return Boom.badRequest(error.message)

      }

    },
    options: {
      tags: ['api'],
      validate: {
        query: Joi.object({
          token: Joi.string().required()
        })
      }
    }
  });

}

