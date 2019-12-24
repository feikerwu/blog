/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

/* eslint-disable-next-line */
var twoSum = function(nums, target) {
  let terms = nums
    .map((item, index) => [item, index])
    .sort((a, b) => a[0] - b[0])

  let low = 0,
    high = terms.length - 1

  while (low <= high) {
    let sum = terms[low][0] + terms[high][0]
    if (sum === target) {
      return [terms[low][1], terms[high][1]]
    } else if (sum < target) {
      low = low + 1
    } else {
      high = high - 1
    }
  }
}
// @lc code=end
