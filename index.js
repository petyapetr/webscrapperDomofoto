const cherio = require("cherio");

const getPageContent = require("./helpers/puppeteer");
const listItemHandlers = require("./handlers/listItemHandlers")

const STREETS = [
	"https://domofoto.ru/list.php?grid=254",
	// "https://domofoto.ru/list.php?uid=11543",
];

async function main() {
	try {
		const houses = [];

		for (const page of STREETS){
			const pageContent = await getPageContent(page);
			const $ = cherio.load(pageContent);

			$("td.n").each((i, item) => {
				let url = $(item).children("a").attr("href");
				url = "https://domofoto.ru" + url;
				const adress = $(item).children("a").text();

				houses.push({url, adress});
			})
		}

		await listItemHandlers(houses);
		console.log(houses)
	} catch(err) {
		console.log("An error has occuped " + err);
	}
};

main()

