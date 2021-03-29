var container = document.querySelector(".container");
for (var i = 0; i<=135; i++){
	const heart = document.createElement('div');
	heart.classList.add('heart');
	container.appendChild(heart);
}

(function animateHeart(){
	anime({
		targets: '.heart',
		translateX: function(){
			return anime.random(-900,900);
		},
		translateY: function(){
			return anime.random(-500,500);
		},
		rotate: 45,
		scale: function(){
			return anime.random(1,3);
		},
		easing: 'easeInOutBack',
		duration: 5000,
		delay: anime.stagger(10),
		complete: animateHeart
	})
}())