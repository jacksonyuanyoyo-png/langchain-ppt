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
    this.initCardNavigation()
    this.initPriorityBanner()
    this.initMarkdownRendering()

    // 初始隐藏导航
    document.querySelector('.navigation')?.classList.remove('show')
  }

  initializeEventListeners() {
    // 工具函数：查找当前激活幻灯片内的可滚动祖先容器
    const getScrollableAncestor = (startEl, activeSlide) => {
      if (!startEl || !activeSlide) return null
      let node = startEl.nodeType === 1 ? startEl : startEl.parentElement
      while (node && node !== activeSlide && node !== document.body) {
        try {
          const style = window.getComputedStyle(node)
          const overflowY = style.overflowY
          const canOverflow = overflowY === 'auto' || overflowY === 'scroll'
          if (canOverflow && node.scrollHeight > node.clientHeight) {
            return node
          }
        } catch(_) {}
        node = node.parentElement
      }
      return null
    }

    // 导航按钮
    document.getElementById("prevBtn").addEventListener("click", () => {
      console.log("点击了上一页按钮")
      this.previousSlide()
    })
    document.getElementById("nextBtn").addEventListener("click", () => {
      console.log("点击了下一页按钮")
      this.nextSlide()
    })

    // 键盘导航（当焦点在任何允许滚动的区域且仍有可滚动距离时，不触发翻页）
    document.addEventListener("keydown", (e) => {
      const activeSlide = this.slides[this.currentSlide - 1]
      const focusEl = document.activeElement || null
      const scrollable = focusEl ? getScrollableAncestor(focusEl, activeSlide) : null
      const isScrollableAreaFocused = !!scrollable
      const canScrollUp = !!(scrollable && scrollable.scrollTop > 0)
      const canScrollDown = !!(scrollable && (scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight))

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

    // 点击圆点导航 - 支持按钮式导航点
    this.activeDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.goToSlide(index + 1)
      })
      
      // 为按钮式导航点添加键盘支持
      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          this.goToSlide(index + 1)
        }
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
    // 禁用鼠标滚轮触发翻页，只保留任何可滚动区域的正常滚动
    document.addEventListener('wheel', (e) => {
      const activeSlide = this.slides[this.currentSlide - 1]
      if (!activeSlide) return
      
      // 检查是否在激活幻灯片中的任意可滚动区域
      const scrollable = getScrollableAncestor(e.target, activeSlide)
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
      this.activeDots[this.currentSlide - 1].removeAttribute("aria-current")
    }

    // 设置新的活动幻灯片
    this.currentSlide = slideNumber
    this.slides[this.currentSlide - 1].classList.add("active")
    if (this.activeDots[this.currentSlide - 1]) {
      this.activeDots[this.currentSlide - 1].classList.add("active")
      this.activeDots[this.currentSlide - 1].setAttribute("aria-current", "page")
    }

    this.updateSlideCounter()
    this.updateNavigation()

    // 添加切换动画
    this.animateSlideTransition()

    // 根据幻灯片内容显示相关横幅
    this.checkSlideSpecificBanners(slideNumber)

    // 重新应用代码高亮
    if (typeof hljs !== 'undefined') {
      setTimeout(() => {
        hljs.highlightAll()
      }, 100)
    }

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

  // 代码高亮功能（使用 Highlight.js）
  initCodeHighlighting() {
    // 清理可能已经被处理过的代码块，然后使用 Highlight.js
    if (typeof hljs !== 'undefined') {
      // 先清理所有代码块中的内联样式
      const codeBlocks = document.querySelectorAll('pre code')
      codeBlocks.forEach(block => {
        // 移除可能存在的内联样式
        const text = block.textContent || block.innerText
        block.innerHTML = text
      })
      
      // 然后应用 Highlight.js
      hljs.highlightAll()
    }
  }

  // 检查特定幻灯片的横幅显示
  checkSlideSpecificBanners(slideNumber) {
    // 这里可以根据不同的幻灯片显示不同的横幅
    // 目前保持空实现
  }

  // 初始化卡片导航功能 - 符合Fidelity Standard Card规范
  initCardNavigation() {
    const cards = document.querySelectorAll('.fidelity-standard-card')
    
    cards.forEach(card => {
      // 为卡片添加键盘导航支持
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          // 查找卡片内的主要链接并触发
          const primaryLink = card.querySelector('.fidelity-card-link')
          if (primaryLink) {
            this.handleCardNavigation(primaryLink.getAttribute('href'))
          }
        }
      })

      // 为卡片内的链接添加导航处理
      const links = card.querySelectorAll('a[href^="#slide-"]')
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          this.handleCardNavigation(link.getAttribute('href'))
        })
      })
    })
  }

  // 处理卡片导航到指定幻灯片
  handleCardNavigation(href) {
    if (!href || !href.startsWith('#slide-')) return
    
    const slideNumber = parseInt(href.replace('#slide-', ''))
    if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
      console.log(`卡片导航到幻灯片 ${slideNumber}`)
      this.goToSlide(slideNumber)
      
      // 添加视觉反馈
      this.showNavigationFeedback(`跳转到第${slideNumber}张幻灯片`)
    }
  }

  // 显示导航反馈
  showNavigationFeedback(message) {
    // 创建临时提示元素
    const feedback = document.createElement('div')
    feedback.textContent = message
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-blue);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 97, 147, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `
    
    document.body.appendChild(feedback)
    
    // 动画显示
    requestAnimationFrame(() => {
      feedback.style.transform = 'translateX(0)'
    })
    
    // 3秒后移除
    setTimeout(() => {
      feedback.style.transform = 'translateX(100%)'
      setTimeout(() => {
        document.body.removeChild(feedback)
      }, 300)
    }, 3000)
  }

  // 初始化Priority Banner功能 - 符合Fidelity规范
  initPriorityBanner() {
    const banner = document.getElementById('priorityBanner')
    if (!banner) return

    // 检查横幅是否已被关闭（会话持久性）
    const bannerKey = 'fidelity-priority-banner-dismissed'
    const isDismissed = sessionStorage.getItem(bannerKey) === 'true'

    if (!isDismissed) {
      this.showPriorityBanner()
    }

    // 关闭按钮事件
    const closeButton = banner.querySelector('.fidelity-banner-close')
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        this.dismissPriorityBanner()
        // 恢复焦点到上一个活动元素
        if (this.lastActiveElement) {
          this.lastActiveElement.focus()
        }
      })

      // 键盘支持
      closeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          this.dismissPriorityBanner()
          if (this.lastActiveElement) {
            this.lastActiveElement.focus()
          }
        }
      })
    }

    // 横幅内链接处理
    const bannerLink = banner.querySelector('.fidelity-banner-link')
    if (bannerLink) {
      bannerLink.addEventListener('click', (e) => {
        e.preventDefault()
        const href = bannerLink.getAttribute('href')
        if (href && href.startsWith('#slide-')) {
          this.handleCardNavigation(href)
          // 可选：点击链接后自动关闭横幅
          // this.dismissPriorityBanner()
        }
      })
    }

    // 记录当前活动元素（用于焦点恢复）
    document.addEventListener('focusin', (e) => {
      if (!banner.contains(e.target)) {
        this.lastActiveElement = e.target
      }
    })
  }

  // 显示Priority Banner
  showPriorityBanner() {
    const banner = document.getElementById('priorityBanner')
    if (!banner) return

    // 添加body类名以调整页面布局
    document.body.classList.add('has-priority-banner')
    
    // 显示横幅
    banner.classList.add('show', 'animating-in')
    
    setTimeout(() => {
      banner.classList.remove('animating-in')
    }, 300)

    console.log('Priority Banner已显示')
  }

  // 关闭Priority Banner
  dismissPriorityBanner() {
    const banner = document.getElementById('priorityBanner')
    if (!banner) return

    // 记录横幅已被关闭（会话持久性）
    const bannerKey = 'fidelity-priority-banner-dismissed'
    sessionStorage.setItem(bannerKey, 'true')

    // 添加关闭动画
    banner.classList.add('animating-out')
    
    setTimeout(() => {
      banner.classList.remove('show', 'animating-out')
      document.body.classList.remove('has-priority-banner')
    }, 300)

    console.log('Priority Banner已关闭并记录到会话存储')
  }

  // 显示不同类型的横幅
  showInfoBanner(message, linkText = '', linkHref = '') {
    this.showCustomBanner('info', 'ℹ️', message, linkText, linkHref)
  }

  showWarningBanner(message, linkText = '', linkHref = '') {
    this.showCustomBanner('warning', '⚠️', message, linkText, linkHref)
  }

  // 显示自定义横幅
  showCustomBanner(type, icon, message, linkText = '', linkHref = '') {
    // 检查字符限制（符合Fidelity规范）
    const maxChars = 130 // 默认版本最多130字符
    if (message.length > maxChars) {
      console.warn(`横幅消息超过${maxChars}字符限制: ${message.length}`)
      message = message.substring(0, maxChars - 3) + '...'
    }

    const banner = document.getElementById('priorityBanner')
    if (!banner) return

    // 更新横幅内容
    banner.className = `fidelity-priority-banner ${type}`
    
    const iconElement = banner.querySelector('.fidelity-banner-icon')
    const messageElement = banner.querySelector('.fidelity-banner-message')
    const linkElement = banner.querySelector('.fidelity-banner-link')

    if (iconElement) iconElement.textContent = icon
    if (messageElement) {
      messageElement.innerHTML = message
      if (linkText && linkHref) {
        messageElement.innerHTML += ` <a href="${linkHref}" class="fidelity-banner-link">${linkText}</a>`
      }
    }

    // 重置会话存储并显示
    sessionStorage.removeItem('fidelity-priority-banner-dismissed')
    this.showPriorityBanner()
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

// 为PPTPresentation类添加markdown渲染方法
PPTPresentation.prototype.initMarkdownRendering = function() {
  if (typeof marked !== 'undefined') {
    // 配置marked选项
    marked.setOptions({
      breaks: true,
      gfm: true
    })
    
    // 渲染所有markdown内容
    this.renderMarkdownContent()
  }
}

PPTPresentation.prototype.renderMarkdownContent = function() {
  // 查找所有markdown源
  const markdownSources = document.querySelectorAll('script[type="text/markdown"]')
  
  markdownSources.forEach(source => {
    const sourceId = source.id
    const targetId = sourceId.replace('markdown-source-', 'markdown-content-')
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      const markdownText = source.textContent || source.innerText
      targetElement.innerHTML = marked.parse(markdownText)
    }
  })
}
