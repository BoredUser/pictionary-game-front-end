<template>
	<div>
		<slick
			ref="slick"
			:options="slickOptions"
			@afterChange="handleAfterChange"
			@beforeChange="handleBeforeChange"
			@breakpoint="handleBreakpoint"
			@destroy="handleDestroy"
			@edge="handleEdge"
			@init="handleInit"
			@reInit="handleReInit"
			@setPosition="handleSetPosition"
			@swipe="handleSwipe"
			@lazyLoaded="handleLazyLoaded"
			@lazyLoadError="handleLazeLoadError"
		>
			<a href="http://placehold.it/2000x1000"
				><img src="http://placehold.it/2000x1000" alt=""
			/></a>
			<a href="http://placehold.it/2000x1000"
				><img src="http://placehold.it/2000x1000" alt=""
			/></a>
			<a href="http://placehold.it/2000x1000"
				><img src="http://placehold.it/2000x1000" alt=""
			/></a>
			<a href="http://placehold.it/2000x1000"
				><img src="http://placehold.it/2000x1000" alt=""
			/></a>
			<a href="http://placehold.it/2000x1000"
				><img src="http://placehold.it/2000x1000" alt=""
			/></a>
		</slick>
	</div>
</template>

<script>
	// MyCarrousel.vue
	import "slick-carousel/slick/slick.css";

	import Slick from "vue-slick";

	export default {
		name: "HowToPlay",
		components: { Slick },

		data() {
			return {
				slickOptions: {
					slidesToShow: 3,
					// Any other options that can be got from plugin documentation
				},
			};
		},

		// All slick methods can be used too, example here
		methods: {
			next() {
				this.$refs.slick.next();
			},

			prev() {
				this.$refs.slick.prev();
			},

			reInit() {
				// Helpful if you have to deal with v-for to update dynamic lists
				this.$nextTick(() => {
					this.$refs.slick.reSlick();
				});
			},

			// Events listeners
			handleAfterChange(event, slick, currentSlide) {
				console.log("handleAfterChange", event, slick, currentSlide);
			},
			handleBeforeChange(event, slick, currentSlide, nextSlide) {
				console.log(
					"handleBeforeChange",
					event,
					slick,
					currentSlide,
					nextSlide
				);
			},
			handleBreakpoint(event, slick, breakpoint) {
				console.log("handleBreakpoint", event, slick, breakpoint);
			},
			handleDestroy(event, slick) {
				console.log("handleDestroy", event, slick);
			},
			handleEdge(event, slick, direction) {
				console.log("handleEdge", event, slick, direction);
			},
			handleInit(event, slick) {
				console.log("handleInit", event, slick);
			},
			handleReInit(event, slick) {
				console.log("handleReInit", event, slick);
			},
			handleSetPosition(event, slick) {
				console.log("handleSetPosition", event, slick);
			},
			handleSwipe(event, slick, direction) {
				console.log("handleSwipe", event, slick, direction);
			},
			handleLazyLoaded(event, slick, image, imageSource) {
				console.log("handleLazyLoaded", event, slick, image, imageSource);
			},
			handleLazeLoadError(event, slick, image, imageSource) {
				console.log(
					"handleLazeLoadError",
					event,
					slick,
					image,
					imageSource
				);
			},
		},
	};
</script>

<style scoped>
	
</style>