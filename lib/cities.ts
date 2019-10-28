
import { join } from 'path';

import { readFileSync } from 'fs';

import * as csvParse from 'csv-parse';

import { models } from './models';

interface City {
  name: string;
  population_2000: number;
  population_2010: number;
  population_2018: number;
  group_quarters_pop: number;
  persons_per_square_mile: number;
  county: string;
}

export function getNHCitiesPopulationCSV(): Promise<any[]> {

  return new Promise((resolve, reject) => {

    let file = readFileSync(join(__dirname, '../seeders/nh-population-estimates-2018.csv'))

    csvParse(file.toString(), (err, output) => {
      if (err) { return reject(err) }

      var currentCounty;

      var cities = output.map(row => {

        if (row[0].match(/County$/)) {

          currentCounty = row[0];

          console.log("current county set", currentCounty);

          return;
        }

        if (row[0] === 'Municipality') {
          return;
        }

        if (row[0] === '------------') {
          return;
        }

        if (row[0] === '') {
          return;
        }

        if (row[1] === '') {
          return;
        }

        if (row[0].match(/Co\./)) {
          return;
        }

        row.push(currentCounty);

        return row;

      });

      cities = cities.filter(s => s != undefined);

      cities = cities.map(row => {

        return {
          name: row[0],
          population_2000: parseInt(row[1].replace(',','')),
          population_2010: parseInt(row[2].replace(',','')),
          population_2018: parseInt(row[3].replace(',','')),
          group_quarters_pop: parseInt(row[5].replace(',','')),
          persons_per_square_mile: parseFloat(row[6].replace(',','')),
          county: row[7]
        }

      });

      resolve(cities);
    });

  });

}

export async function importCities(cities: City[]): Promise<any[]> {

  return Promise.all(cities.map(city => {

    return models.City.findOrCreate({
      where: {
        name: city.name
      },
      defaults: {
        name: city.name,
        county: city.county,
        population: city.population_2018
      }
    });
    
  }));

}

