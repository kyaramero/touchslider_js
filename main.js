// Getting elements
const slider = document.querySelector('.slider-container'),
slides = Array.from(document.querySelectorAll('.slide'))

// Initial values
let isDragging = false, 
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex = 0

// Event listeners
slides.forEach((slide, index) => {
    const slideImg = slide.querySelector('img')
    slideImg.addEventListener('dragstart', (e) => e.preventDefault())

    // Touchscreen events
    slide.addEventListener('touchstart', touchStart(index))
    slide.addEventListener('touchend', touchEnd)
    slide.addEventListener('touchmove', touchMove)

    // Mouse events
    slide.addEventListener('mousedown', touchStart(index))
    slide.addEventListener('mouseup', touchEnd)
    slide.addEventListener('mouseleave', touchEnd)
    slide.addEventListener('mousemove', touchMove)
})

window.addEventListener('resize', setPositionByIndex)

// Context Menu Disabled
window.oncontextmenu = function (event){
    event.preventDefault()
    event.stopPropagation()
    return false
}

function touchStart(index){
    return function(event){
        currentIndex = index
        startPos = getPositionX(event)
        isDragging = true

        animationID = requestAnimationFrame(animation)
        slider.classList.add('grabbing')
    }
}

function touchEnd(){
    cancelAnimationFrame(animationID)
    isDragging = false   

    const movedBy = currentTranslate - prevTranslate
    if(movedBy < -100 && currentIndex < slides.length - 1)
        currentIndex +=1

    if(movedBy > 100 && currentIndex > 0) currentIndex -=1

    setPositionByIndex()

    slider.classList.remove('grabbing')
}

function touchMove(event) {
    if (isDragging){
        const currentPosition = getPositionX(event)
        currentTranslate = prevTranslate + currentPosition - startPos
    }   
}

function getPositionX (event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function animation() {
    setSliderPosition()
    if(isDragging) requestAnimationFrame(animation)
}

function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate
    setSliderPosition()
}

function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`
}