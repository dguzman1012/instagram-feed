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

	async getInstagramPosts({request, response}){

		let query = request.get()
		if (!Object.keys(query).length){
			response.json({success:false, data:{}})
			return;
		}

		if (query.fb_location === undefined){
			response.json({success:false, data:{}})
			return;				
		}

		const facebook_location = query.fb_location;
		// response.send(facebook_location); 
		/**
		 * Getting the IG location ID
		 */
		const url = 'https://api.instagram.com/v1/locations/search?facebook_places_id='+ facebook_location +'&access_token='+ Env.get('INSTAGRAM_ACCESS_TOKEN');
		const res = await got(url)
		const ig_location = JSON.parse(res.body).data[0]

		/**
		 * Getting the lastest posts
		 */
		if (!Object.keys(ig_location).length){
			response.json({success:false, data:[]})
			return;
		}

		if (ig_location.id === undefined){
			response.json({success:false, data:[]})
			return;				
		}

		const url_ig = 'https://api.instagram.com/v1/locations/'+ ig_location.id +'/media/recent?access_token='+ Env.get('INSTAGRAM_ACCESS_TOKEN');
		const ig_posts_data = await got(url_ig)
		const posts = JSON.parse(ig_posts_data.body).data

		if (posts.length >=0){
			response.json(posts)
		}else{
			response.json({
				success: false
			})
		}
	}

}

module.exports = ApiController
