<template>
	<p>{{ data }}</p>
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
		mounted () {let newDate = this.date;
				let today = new Date(),
						todaysMonth = today.getMonth() + 1,
						todaysYear = today.getFullYear(),
						todaysDay = today.getDate()

				let difference = 0;

				if (todaysDay < 10) {
					todaysDay = '0' + todaysDay
				}
				if(!todaysMonth[1]){
          todaysMonth = '0' + todaysMonth.toString();
        }
				if (!newDate[7]) {
          newDate = '0' + newDate.toString();
				}
				// If posted today
				if (newDate === (todaysMonth).toString() + (todaysDay).toString() + (todaysYear).toString()) {
          newDate = '0 days ago'
          this.data = newDate;
				// If not posted today
				} else {

					// If post day number is less than todays day number
					if ((newDate[2] + newDate[3] < (todaysDay).toString()) &&
							// And post month is current month
						(newDate[0] + newDate[1] === (todaysMonth).toString()) &&
							// And post year is current year
						(newDate[4] + newDate[5] + newDate[6] + newDate[7] === (todaysYear).toString())) {

						difference = todaysDay - (newDate[2] + newDate[3])

						// Account for pluralisation
						if (difference > 1) {
							this.data = difference + ' days ago'
						} else {
							this.data = difference + ' day ago'
						}

					// If post day number is less than todays day number
					} else if ((newDate[0] + newDate[1] < (todaysMonth).toString()) &&
						// And post year is current year
						(newDate[4] + newDate[5] + newDate[6] + newDate[7] === (todaysYear).toString())) {
						difference = todaysMonth - (newDate[0] + newDate[1])

						// Account for pluralisation
						if (difference > 1) {
							this.data = difference + ' months ago'
						} else {
							this.data = difference + ' month ago'
						}

					// If post year is less than current year
					} else if ((newDate[4] + newDate[5] + newDate[6] + newDate[7]) < (todaysYear).toString()) {
						difference = todaysYear - (newDate[4] + newDate[5] + newDate[6] + newDate[7])

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