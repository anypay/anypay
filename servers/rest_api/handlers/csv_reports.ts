
import * as moment from 'moment';
import * as Joi from 'joi';
import * as Boom from 'boom';

import { buildReportCsvFromDates } from '../../../lib/wire';
import * as models from '../../../lib/models';

export async function accountCSVReports(server) {

  server.route({
    method: 'GET',
    path: '/csv_reports',
    handler: async (req, h) => {

      console.log('query', req.query);

      let token = await models.AccessToken.findOne({ where: {

        uid: req.query.token

      }});

      if (!token) {

        return Boom.unauthorized('invalid access token');
      }

      console.log(req.query);

      let start_date = moment(req.query.start_date);
      let end_date = moment(req.query.end_date);

      let content = await buildReportCsvFromDates(
        token.account_id,
        start_date,
        end_date
      );

      console.log(content);

      let start_formatted = start_date.format('MM-DD-YYYY');
      let end_formatted = end_date.format('MM-DD-YYYY');

      let filename = `anypay_report_${start_formatted}_${end_formatted}.csv`

      console.log(filename);

      let response = h.response(content).header("Content-Disposition", `attachment;filename=${filename}`);

      return response;

    },
    config: {
      tags: ['api'],
      //auth: "token",
      validate: {
        query: {
          start_date: Joi.date().required(),
          end_date: Joi.date().required(),
          token: Joi.string().required()
        }
      }
    }
  });

}

