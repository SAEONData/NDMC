import nrf_saeon from '../images/nrf_saeon.png'
import sa_flag from '../images/sa_flag.jpg'

export const data = {
	title: "Document Links",
	logoTop: { src: nrf_saeon, width: "65%" },
	logoBottom: { src: sa_flag, width: "30%" },
	nav: [
		{
			id: 1, text: "About", children: [
				{ id: 11, window: "modal", text: "NCCIS", link: "http://app01.saeon.ac.za/dev/UI_footside/page_about_NCCIS.html" },
				{ id: 12, window: "modal", text: "NCCRD", link: "http://app01.saeon.ac.za/dev/UI_footside/page_about_NCCRD.html" },
				{ id: 13, window: "modal", text: "NHE (NDEDB)", link: "http://app01.saeon.ac.za/dev/UI_footside/page_about_NDEDB.html" },
				// { id: 14, window: "modal", text: "SAEON", link: "http://app01.saeon.ac.za/dev/UI_footside/page_SAEON.html" },
				// { id: 15, window: "modal", text: "Open Data Platform", link: "http://app01.saeon.ac.za/dev/UI_footside/page_ODP.html" },
			]
		},
		{
			id: 2, text: "SARVA", children: [
				{ id: 21, window: "modal", text: "SARVA Framework", link: "http://app01.saeon.ac.za/dev/UI_footside/page_semantic.html" },
				{ id: 22, window: "modal", text: "Concepts", link: "http://app01.saeon.ac.za/dev/UI_footside/page_concepts.html" },
				{ id: 23, window: "blank", text: "SARVA 2.0", link: "http://sarva2.dirisa.org/" },
				{ id: 24, window: "blank", text: "SARVA 3.0 (Beta)", link: "http://app01.saeon.ac.za/sarva3/" },
				{ id: 25, window: "modal", text: "Profiler", link: "http://app01.saeon.ac.za/dev/UI_footside/page_concepts.html" },
				{ id: 26, window: "modal", text: "SARVA Atlases", link: "http://app01.saeon.ac.za/dev/UI_footside/page_atlas.html" },
			]
		},
		{
			id: 3, text: "Systems Integration", children: [
				{ id: 31, window: "modal", text: "Framework", link: "http://app01.saeon.ac.za/dev/UI_footside/page_frame.html" },
				{ id: 32, window: "modal", text: "Options", link: "http://app01.saeon.ac.za/dev/UI_footside/page_options.html" },
				{ id: 33, window: "modal", text: "Data", link: "http://app01.saeon.ac.za/dev/UI_footside/page_data.html" },
				{ id: 35, window: "modal", text: "Example APIs", link: "http://app01.saeon.ac.za/dev/UI_footside/page_API.html" },
				{ id: 36, window: "modal", text: "Example Components", link: "http://app01.saeon.ac.za/dev/UI_footside/page_component.html" }
			]
		},
	]
}
