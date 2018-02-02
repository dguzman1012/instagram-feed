'use strict'

const got = use('got')
const Env = use('Env')

class ApiController {

	async getFacebookToken({request, response, session}){
		const url = 'https://graph.facebook.com/oauth/access_token?client_id='+ Env.get('FACEBOOK_CLIENT_ID') +'&client_secret='+ Env.get('FACEBOOK_CLIENT_SECRET') +'&grant_type=client_credentials';
		const res = await got(url)
		const facebook_token = JSON.parse(res.body).access_token
		session.put('facebook_token', facebook_token)

		response.json({
			success: true
		})

	}

	async getFacebookLocations({request, response, session}){
		let query = request.get()
		if (!Object.keys(query).length){
			response.json({success:false, data:{}})
			return;
		}

		if (query.q === undefined){
			response.json({success:false, data:{}})
			return;				
		}

		const url = "https://graph.facebook.com/v2.11/search?type=place&q="+query.q+"&fields=name,checkins,picture,location,rating_count&access_token=" + session.get("facebook_token");
		const res = await got(url)
		const locations = JSON.parse(res.body)
		if (locations.data){
			response.json(locations.data)
		}else{
			response.json({
				success: false
			})
		}
	}

	getInstagramToken({request, response}){

		response.send("Epale")

		// https://api.instagram.com/v1/locations/search?facebook_places_id=139080022815160&access_token=32417473.d2d6896.a3d0ece5a1a54ac6b3c2245a6e7f70a6
		// https://api.instagram.com/v1/locations/787861/media/recent?access_token=32417473.d2d6896.a3d0ece5a1a54ac6b3c2245a6e7f70a6
		// 
		/*
		FACEBOOK_CLIENT_ID=165456687426285
FACEBOOK_CLIENT_SECRET=5daaee1ef287b57a1805ec1da672987d

INSTAGRAM_CLIENT_ID=d2d689686d704a9abc55caf030bc1c5e
INSTAGRAM_CLIENT_SECRET=6d1ab31e70f9415293a4b2e46655cdee
INSTAGRAM_CODE=c9e89d33365f435a8b6243cf26a65f08
INSTAGRAM_ACCESS_TOKEN=32417473.d2d6896.a3d0ece5a1a54ac6b3c2245a6e7f70a6
		 */
	}

}

module.exports = ApiController
