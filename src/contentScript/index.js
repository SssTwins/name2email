console.info('contentScript is running')

document.addEventListener('input', async function (event) {
  const target = event.target
  // 检查目标元素是否是输入框
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    const name = target.value.trim()
    // 如果输入的是姓名，则生成候选项
    if (name) {
      chrome.runtime.sendMessage(
        chrome.runtime.id,
        {
          type: 'GET_DATA',
          key: name,
        },
        {},
        (response) => {
          console.log(response)
          showSuggestions(target, response)
        },
      )
    } else {
      hideSuggestions()
    }
  }
})

// 显示候选项
function showSuggestions(inputElement, suggestions) {
  // 移除已有的弹出框
  hideSuggestions()

  // 创建弹出框
  const popup = document.createElement('div')
  popup.id = 'suggestions-popup'
  popup.style.position = 'absolute'
  popup.style.border = '1px solid #ccc'
  popup.style.background = '#fff'
  popup.style.zIndex = '9999' // 设置一个非常大的 z-index 值
  popup.style.maxHeight = '150px'
  popup.style.overflowY = 'auto'
  popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)' // 添加阴影
  popup.style.borderRadius = '4px' // 圆角
  popup.style.paddingTop = '24px' // 为关闭按钮预留空间

  // 创建关闭按钮
  const closeButton = document.createElement('button')
  closeButton.textContent = '×'
  closeButton.style.position = 'absolute'
  closeButton.style.top = '5px'
  closeButton.style.right = '5px'
  closeButton.style.background = 'transparent'
  closeButton.style.border = 'none'
  closeButton.style.cursor = 'pointer'
  closeButton.style.fontSize = '16px'
  closeButton.style.color = '#999'
  closeButton.style.padding = '0'
  closeButton.style.margin = '0'
  closeButton.style.lineHeight = '1'
  closeButton.addEventListener('click', function () {
    hideSuggestions()
  })
  popup.appendChild(closeButton)

  // 添加候选项
  if (suggestions && suggestions.length > 0) {
    suggestions.forEach((suggestion) => {
      const item = document.createElement('div')
      item.textContent = suggestion.name + ' - ' + suggestion.email
      item.style.padding = '8px 12px'
      item.style.cursor = 'pointer'
      item.style.borderBottom = '1px solid #eee' // 分隔线
      item.addEventListener('click', function () {
        inputElement.value = suggestion.email // 将选中的内容填充到输入框
        hideSuggestions()
      })
      popup.appendChild(item)
    })
  } else {
    const item = document.createElement('div')
    item.textContent = '未搜索到对应选手'
    item.style.padding = '8px 12px'
    item.style.cursor = 'pointer'
    item.style.borderBottom = '1px solid #eee' // 分隔线
    popup.appendChild(item)
  }

  // 将弹出框添加到页面中
  document.body.appendChild(popup)

  // 定位弹出框
  const rect = inputElement.getBoundingClientRect()
  popup.style.top = `${rect.bottom + window.scrollY}px`
  popup.style.left = `${rect.left + window.scrollX}px`
}

// 隐藏候选项
function hideSuggestions() {
  const popup = document.getElementById('suggestions-popup')
  if (popup) {
    popup.remove()
  }
}
