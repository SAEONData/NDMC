import nrf_saeon from '../images/nrf_saeon.png'
import sa_flag from '../images/sa_flag.jpg'

export const data = {
	enabled: false,
	title: "Document Links",
	logoTop: { src: nrf_saeon, width: "65%" },
	logoBottom: { src: sa_flag, width: "30%" },
	nav: [
		{
			id: 1, text: "Category", children: [
				{ id: 11, text: "Nav with link", link: "http://www.example.com" }
			]
		},
		{
			id: 2, text: "Another Category", children: [
				{ id: 21, text: "Nav with no link" }
			]
		}
	]
}
