const path = require('path');
const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');


module.exports = {
  app: function () {
	  const app = express()
	  const indexPath = path.join(__dirname, 'index.html')
	  const publicPath = express.static(path.join(__dirname, 'public'))
	  app.get('/', function (_, res) { res.sendFile(indexPath) })
	  app.use('/public', publicPath)
	  app.use(cors());

	  // ROUTES
	  app.use('/api/covid', (req, res) => {
		  const API_URI = 'https://github.com/nychealth/coronavirus-data/blame/d34e6aab1e0dd0e0125e74519489e7893d33c9dd/tests-by-zcta.csv'
		  axios(API_URI)
			  .then(response => {
				  const html = response.data;
				  const $ = cheerio.load(html);
				  const statsTable = $('.width-full > div');
				  const covidByZipCode = [];
				  let id = 1

				  statsTable.each(function () {

					  const zip_code = $(this).find('.js-file-line').text().split(',')[0];
					  const pos = $(this).find('.js-file-line').text().split(',')[1];
					  const tot = $(this).find('.js-file-line').text().split(',')[2];

					  if (zip_code !== "" && zip_code !== "MODZCTA" && zip_code !== "NA") {
						  covidByZipCode.push({
							  "id": id,
							  "zipCode": zip_code,
							  "positive": pos,
							  "total": tot
						  })
						  id++;
					  }
				  })
				  res.status(200).send(JSON.stringify(covidByZipCode));
			  })
	  });

	  return app;
  }
}