<template>
	<div>{{ data }}</div>
</template>

<script>
	export default {
		data () {
			return {
				data: ''
			}
		},
		props: {
			date: String
		},
		mounted () {
				let 	today = new Date(),
						todaysMonth = today.getMonth() + 1,
						todaysYear = today.getFullYear(),
						todaysDay = today.getDate()

				let difference = 0;

				if (todaysDay < 10) {
					todaysDay = '0' + todaysDay
				}

				if (todaysMonth.toString().charAt(0) !== '1') {
					todaysMonth = '0' + todaysMonth
				}

				console.log(this.date)
				console.log((todaysMonth).toString() + (todaysDay).toString() + (todaysYear).toString())

				// If posted today
				if (this.date === (todaysMonth).toString() + (todaysDay).toString() + (todaysYear).toString()) {
					this.data = '0 days ago'

				// If not posted today
				} else {

					// If post day number is less than todays day number
					if ((this.date[2] + this.date[3] < todaysDay) && 
							// And post month is current month
						(this.date[0] + this.date[1] === todaysMonth) &&
							// And post year is current year
						(this.date[4] + this.date[5] + this.date[6] + this.date[7] === todaysYear)) {

						difference = todaysDay - (this.date[2] + this.date[3])

						// Account for pluralisation
						if (difference > 1) {
							this.data = difference + ' days ago'
						} else {
							this.data = difference + ' day ago'
						}

					// If post day number is less than todays day number
					} else if ((this.date[0] + this.date[1] < todaysMonth) &&
						// And post year is current year
						(this.date[4] + this.date[5] + this.date[6] + this.date[7] === todaysYear)) {
						difference = todaysMonth - (this.date[0] + this.date[1])

						// Account for pluralisation
						if (difference > 1) {
							this.data = difference + ' months ago'
						} else {
							this.data = difference + ' month ago'
						}

					// If post year is less than current year
					} else if ((this.date[4] + this.date[5] + this.date[6] + this.date[7]) < todaysYear) {
						difference = todaysYear - (this.date[4] + this.date[5] + this.date[6] + this.date[7])

						// Account for pluralisation
						if (difference > 1) {
							this.data = difference + ' years ago'
						} else {
							this.data = difference + ' year ago'
						}
					}
				}
			}
		}
	//}
</script>

<style lang="scss" scoped>

</style>