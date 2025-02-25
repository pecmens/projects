以下是针对您开发的动态表格页面生成的一份详细文档，内容包括功能描述、实现方法以及使用说明。此文档旨在帮助用户和开发者快速了解页面的功能和实现细节。

---

# 动态表格页面功能与实现方法文档

## 一、功能概述

本页面是一个基于HTML、CSS和JavaScript实现的单页面动态表格应用，主要用于录入和统计“件数”、“重量”及“备注”等信息。它具备以下核心功能：

1. **动态添加行**：当用户在任意单元格中输入数据时，自动在当前行下方新增一行空白行。
2. **序号自动生成**：第一列显示“序号”，从第二行开始按顺序生成数字（1, 2, 3...）。
3. **多列合计统计**：
    - 第二列“件数”显示所有已填入数据的合计值。
    - 第三列“重量”显示所有已填入数据的合计值。
4. **总计显示**：最后一行显示当前表格的有效行数量（即序号的最大值）、件数合计值和重量合计值。

---

## 二、功能实现方法

### 1. 页面结构
- **HTML部分**：
    - 使用`<table>`标签定义表格结构。
    - 表头（`<thead>`）包含四列：序号、件数、重量、备注。
    - 表体（`<tbody>`）初始包含一行空白数据行。
    - 表尾（`<tfoot>`）用于显示总计信息。

- **CSS部分**：
    - 设置表格的基本样式，包括边框、对齐方式、宽度等。
    - 使用`text-align: center`确保表格内容居中对齐。
    - 使用`font-weight: bold`突出显示总计行。

### 2. 核心逻辑
- **动态添加行**：
    - 使用`document.createElement('tr')`创建新行。
    - 每次新增行时，自动递增`rowCount`变量以生成正确的序号。
    - 在每一行的“件数”、“重量”和“备注”列中插入可编辑的`<input>`元素。

- **合计统计**：
    - 使用`querySelectorAll`选择所有对应的输入框（如`.quantity`和`.weight`）。
    - 遍历这些输入框，累加有效数值，并将结果更新到总计行的对应单元格中。
    - 在每次输入事件触发时调用统计函数，确保实时更新。

- **事件监听**：
    - 为每一行绑定`input`事件监听器，监听用户在“件数”或“重量”列中的输入。
    - 当检测到输入时，检查是否需要新增一行，并更新所有总计值。

### 3. 关键代码片段

#### 初始化表格
```html
<table id="dynamicTable">
    <thead>
        <tr>
            <th>序号</th>
            <th>件数</th>
            <th>重量</th>
            <th>备注</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td><input type="number" class="quantity"></td>
            <td><input type="number" class="weight"></td>
            <td><input type="text" class="note"></td>
        </tr>
    </tbody>
    <tfoot>
        <tr class="total-row">
            <td id="totalCount">1</td>
            <td id="totalQuantity">0</td>
            <td id="totalWeight">0</td>
            <td></td>
        </tr>
    </tfoot>
</table>
```

#### 动态添加行
```javascript
function addNewRow() {
    rowCount++; // 增加行计数
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="number" class="quantity"></td>
        <td><input type="number" class="weight"></td>
        <td><input type="text" class="note"></td>
    `;
    tableBody.appendChild(newRow);
    attachEventListenersToRow(newRow);
    updateTotals(); // 更新总计
}
```

#### 合计统计
```javascript
function updateTotalWeight() {
    let totalWeight = 0;
    const weightInputs = document.querySelectorAll('.weight');
    weightInputs.forEach(input => {
        if (!isNaN(input.value)) {
            totalWeight += parseFloat(input.value) || 0;
        }
    });
    totalWeightCell.textContent = totalWeight.toFixed(2);
}

function updateTotalQuantity() {
    let totalQuantity = 0;
    const quantityInputs = document.querySelectorAll('.quantity');
    quantityInputs.forEach(input => {
        if (!isNaN(input.value)) {
            totalQuantity += parseFloat(input.value) || 0;
        }
    });
    totalQuantityCell.textContent = totalQuantity.toFixed(0); // 不保留小数
}
```

#### 事件绑定
```javascript
function attachEventListenersToRow(row) {
    let hasGeneratedRow = false; // 标记该行是否已生成新行

    row.addEventListener('input', (event) => {
        if (event.target.classList.contains('quantity') || event.target.classList.contains('weight')) {
            updateTotals(); // 更新所有总计
        }

        // 检查是否需要新增一行
        if (!hasGeneratedRow) {
            const inputs = row.querySelectorAll('input');
            if (inputs[0].value || inputs[1].value || inputs[2].value) {
                addNewRow();
                hasGeneratedRow = true; // 设置标记为已生成
            }
        }
    });
}
```

---

## 三、使用说明

### 1. 页面加载
- 页面加载后，默认显示一个包含表头、一行空白数据行和总计行的表格。

### 2. 数据录入
- 在“件数”或“重量”列中输入数值，或在“备注”列中输入文本。
- 输入完成后，表格会自动在当前行下方新增一行空白行。

### 3. 序号自动生成
- 第一列“序号”会根据当前行数自动生成连续的数字（1, 2, 3...）。

### 4. 合计统计
- 最后一行显示以下信息：
    - 第一列：当前表格的有效行数量（即序号的最大值）。
    - 第二列：所有“件数”的合计值。
    - 第三列：所有“重量”的合计值。

### 5. 动态调整
- 如果删除某行的数据，合计值会自动重新计算并更新。

---

## 四、注意事项

1. **输入格式**：
    - “件数”和“重量”列仅接受数值输入，非数值输入将被忽略。
    - “备注”列支持任意文本输入。

2. **性能优化**：
    - 对于大规模数据录入，建议定期保存数据以防丢失。
    - 若数据量过大，可能会影响页面性能。

3. **兼容性**：
    - 本页面适用于现代浏览器（如Chrome、Firefox、Edge等），请确保浏览器支持HTML5、CSS3和JavaScript。

---

通过以上文档，您可以全面了解该动态表格页面的功能和实现方法。希望这份文档对您有所帮助！