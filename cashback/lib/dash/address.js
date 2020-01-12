
const address = process.env.DASH_DONATION_ADDRESS || 'XsDFwjpGkdwtc86ce4apMNe6ssQCRAs7eH'

module.exports.getDonationAddress = async function() {

	return address;
}
