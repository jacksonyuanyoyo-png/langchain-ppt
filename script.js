class PPTPresentation {
  constructor() {
    this.currentSlide = 1
    this.slides = document.querySelectorAll(".slide")
    this.totalSlides = this.slides.length  // Set to actual number of slides (should be 17)
    this.dots = document.querySelectorAll(".dot")

    // 只保留对应数量的dots
    this.activeDots = Array.from(this.dots).slice(0, this.totalSlides)
    
    // 隐藏多余的dots
    for (let i = this.totalSlides; i < this.dots.length; i++) {
      this.dots[i].style.display = 'none';
    }

    console.log(`发现 ${this.totalSlides} 张幻灯片，${this.activeDots.length} 个活跃圆点`)

    // 清理所有幻灯片的内联样式
    this.slides.forEach(slide => {
      slide.style.transform = ""
      slide.style.opacity = ""
    })

    this.initializeEventListeners()
    this.updateSlideCounter()
    this.updateNavigation()
    this.initCodeHighlighting()

    // 初始隐藏导航
    document.querySelector('.navigation')?.classList.remove('show')
  }

  initializeEventListeners() {
    // 导航按钮
    document.getElementById("prevBtn").addEventListener("click", () => {
      console.log("点击了上一页按钮")
      this.previousSlide()
    })
    document.getElementById("nextBtn").addEventListener("click", () => {
      console.log("点击了下一页按钮")
      this.nextSlide()
    })

    // 键盘导航（当焦点在允许滚动的区域且仍有可滚动距离时，不触发翻页）
    document.addEventListener("keydown", (e) => {
      const activeSlide = this.slides[this.currentSlide - 1]
      const scrollable = activeSlide?.querySelector('.content-right')

      const isScrollableAreaFocused = document.activeElement && (scrollable?.contains(document.activeElement))
      const canScrollUp = scrollable && scrollable.scrollTop > 0
      const canScrollDown = scrollable && (scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight)

      switch (e.key) {
        case "ArrowLeft":
          this.previousSlide()
          break
        case "ArrowUp":
          if (isScrollableAreaFocused && canScrollUp) return
          this.previousSlide()
          break
        case "ArrowRight":
          this.nextSlide()
          break
        case "ArrowDown":
        case " ":
          if (isScrollableAreaFocused && canScrollDown) {
            // 让默认滚动发生
            return
          }
          e.preventDefault()
          this.nextSlide()
          break
        case "Home":
          this.goToSlide(1)
          break
        case "End":
          this.goToSlide(this.totalSlides)
          break
      }
    })

    // 点击圆点导航
    this.activeDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.goToSlide(index + 1)
      })
    })

    // 触摸手势支持
    let startX = 0
    let startY = 0

    document.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    })

    document.addEventListener("touchend", (e) => {
      if (!startX || !startY) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY

      const diffX = startX - endX
      const diffY = startY - endY

      // 水平滑动优先
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) {
          // 最小滑动距离
          if (diffX > 0) {
            this.nextSlide()
          } else {
            this.previousSlide()
          }
        }
      }

      startX = 0
      startY = 0
    })
    // 禁用鼠标滚轮触发翻页，只保留内容区域的正常滚动
    document.addEventListener('wheel', (e) => {
      const activeSlide = this.slides[this.currentSlide - 1]
      if (!activeSlide) return
      
      // 检查是否在可滚动区域
      const hoveredScrollable = e.target && e.target.closest ? e.target.closest('.content-right') : null
      const scrollable = hoveredScrollable && activeSlide.contains(hoveredScrollable) ? hoveredScrollable : null
      
      // 如果在可滚动区域，允许正常滚动
      if (scrollable) {
        return // 允许默认滚动行为
      }
      
      // 如果不在可滚动区域，阻止默认行为以避免页面滚动
      e.preventDefault()
      
      // 不再触发翻页，完全禁用滚轮翻页功能
    }, { passive: false })

    // 切换按钮：手动显示/隐藏导航
    const navToggleBtn = document.getElementById('navToggleBtn')
    const nav = document.querySelector('.navigation')
    if (navToggleBtn && nav) {
      navToggleBtn.addEventListener('click', () => {
        nav.classList.toggle('show')
        // 导航显示时，按钮变为关闭图标
        if (nav.classList.contains('show')) {
          navToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>`
        } else {
          // 导航隐藏时，按钮变为菜单图标
          navToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>`
        }
      })
    }
  }

  goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > this.totalSlides) return

    console.log(`切换到幻灯片 ${slideNumber}`)

    // 移除当前活动状态
    this.slides[this.currentSlide - 1].classList.remove("active")
    if (this.activeDots[this.currentSlide - 1]) {
      this.activeDots[this.currentSlide - 1].classList.remove("active")
    }

    // 设置新的活动幻灯片
    this.currentSlide = slideNumber
    this.slides[this.currentSlide - 1].classList.add("active")
    if (this.activeDots[this.currentSlide - 1]) {
      this.activeDots[this.currentSlide - 1].classList.add("active")
    }

    this.updateSlideCounter()
    this.updateNavigation()

    // 添加切换动画
    this.animateSlideTransition()

    // 切换幻灯片后不自动改变导航显示，由按钮控制
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.goToSlide(this.currentSlide + 1)
    }
  }

  previousSlide() {
    console.log(`当前页: ${this.currentSlide}, 尝试返回上一页`)
    if (this.currentSlide > 1) {
      this.goToSlide(this.currentSlide - 1)
    } else {
      console.log("已经是第一页，无法返回")
    }
  }

  updateSlideCounter() {
    document.getElementById("slideCounter").textContent = `${this.currentSlide} / ${this.totalSlides}`
  }

  updateNavigation() {
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")

    prevBtn.disabled = this.currentSlide === 1
    nextBtn.disabled = this.currentSlide === this.totalSlides
  }

  // 移除滚动驱动的显示逻辑，改为仅按钮控制

  bindScrollableListenerForActiveSlide() {
    const activeSlide = this.slides[this.currentSlide - 1]
    const scrollable = activeSlide?.querySelector('.content-right')
    if (!scrollable) return
    // 先移除旧监听（通过克隆节点的方式快速移除所有监听）
    const newScrollable = scrollable.cloneNode(true)
    scrollable.parentNode.replaceChild(newScrollable, scrollable)
    newScrollable.addEventListener('scroll', () => this.updateNavigationVisibility(), { passive: true })
  }

  animateSlideTransition() {
    const currentSlideElement = this.slides[this.currentSlide - 1]

    // 清除任何内联样式，让CSS类控制动画
    currentSlideElement.style.transform = ""
    currentSlideElement.style.opacity = ""
    
    console.log("动画切换完成")
  }

  // 自动播放功能（可选）
  startAutoPlay(interval = 10000) {
    this.autoPlayInterval = setInterval(() => {
      if (this.currentSlide < this.totalSlides) {
        this.nextSlide()
      } else {
        this.goToSlide(1) // 循环播放
      }
    }, interval)
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
      this.autoPlayInterval = null
    }
  }

  // 全屏模式
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // 代码高亮功能（简单版）
  initCodeHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code')
    codeBlocks.forEach(block => {
      this.highlightCode(block)
    })
  }

  highlightCode(codeBlock) {
    let code = codeBlock.innerHTML
    
    // Python 关键字高亮
    const pythonKeywords = [
      'from', 'import', 'def', 'class', 'if', 'else', 'elif', 'for', 'while', 
      'try', 'except', 'finally', 'with', 'as', 'return', 'yield', 'break', 
      'continue', 'pass', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None'
    ]
    
    // 高亮注释
    code = code.replace(/(#.*)/g, '<span style="color: #6a9955; font-style: italic;">$1</span>')
    
    // 高亮字符串
    code = code.replace(/(['"`])(.*?)\1/g, '<span style="color: #ce9178;">$1$2$1</span>')
    
    // 高亮 Python 关键字
    pythonKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      code = code.replace(regex, `<span style="color: #569cd6; font-weight: bold;">${keyword}</span>`)
    })
    
    // 高亮函数调用
    code = code.replace(/(\w+)(\()/g, '<span style="color: #dcdcaa;">$1</span>$2')
    
    // 高亮数字
    code = code.replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #b5cea8;">$1</span>')
    
    codeBlock.innerHTML = code
  }
}

// 初始化演示
document.addEventListener("DOMContentLoaded", () => {
  const presentation = new PPTPresentation()

  // 添加全屏快捷键
  document.addEventListener("keydown", (e) => {
    if (e.key === "F11") {
      e.preventDefault()
      presentation.toggleFullscreen()
    }

    // ESC 键退出自动播放
    if (e.key === "Escape") {
      presentation.stopAutoPlay()
    }
  })

  // 可选：启用自动播放（取消注释下面的行）
  // presentation.startAutoPlay(15000); // 15秒自动切换

  console.log("LangChain PPT 演示已加载完成")
  console.log("快捷键：")
  console.log("- 方向键/空格键：切换幻灯片")
  console.log("- Home/End：跳转到首页/末页")
  console.log("- F11：全屏模式")
  console.log("- ESC：停止自动播放")
})

// 添加一些实用功能
window.addEventListener("load", () => {
  // 预加载所有幻灯片内容（不强制设置visibility）
  const slides = document.querySelectorAll(".slide")
  console.log(`页面加载完成，找到 ${slides.length} 张幻灯片`)

  // 添加打印样式
  const printStyles = `
        @media print {
            .navigation, .slide-index { display: none !important; }
            .slide { 
                position: static !important; 
                opacity: 1 !important; 
                transform: none !important;
                page-break-after: always;
                height: 100vh;
            }
            .slide:last-child { page-break-after: avoid; }
        }
    `

  const styleSheet = document.createElement("style")
  styleSheet.textContent = printStyles
  document.head.appendChild(styleSheet)
})
