const cherio = require("cherio")
const getPageContent = require("../helpers/puppeteer");

module.exports = async function listItemHandlers(data) {
	try {
		for (let initialData of data) {
			const detailContent = await getPageContent(initialData.url);
			const $ = cherio.load(detailContent);

			$("#top-image > table > tbody > tr:nth-child(1)").remove().end().html();

			$("tr.h21").each((i, items) => {
				let name = $(items).children("td.ds.nw").text() || "Description";
				name = normalize(name);

				let value = $(items).children("td.d");
				value = value.text();
				initialData[name] = value;
				
				let stageOne = $(items).children("td.d");
				let stageTwo = stageOne.children("a");

				if (stageTwo.length > 0) {
					const urlName = "Url_" + name;
					let links = [];

					stageTwo.each(function(i, el) {
						let url = $(el).attr("href");
						url = "https://domofoto.ru" + url;
						url.toString()
						links.push(url)
					})

					links = links.join(", ");
					initialData[urlName] = links;
				}

				delete initialData.UrlDescription
			})
		}
	} catch(err) { throw err }
};

function normalize(str) {
	return str = str.replace(":", "").replace("/", "_").replace(" ", "_");
};