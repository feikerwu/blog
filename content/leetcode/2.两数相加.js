/* eslint-disable */
/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  let head = new ListNode()
  let cur = head
  let carry = 0
  let sum = 0

  while (l1 !== null || l2 !== null) {
    if (l1 !== null && l2 !== null) {
      sum = l1.val + l2.val + carry
      l1 = l1.next
      l2 = l2.next
    } else if (l1 === null) {
      sum = l2.val + carry
      l2 = l2.next
    } else if (l2 === null) {
      sum = l1.val + carry
      l1 = l1.next
    }

    let term = new ListNode()
    term.val = sum % 10
    carry = Math.floor(sum / 10)
    cur.next = term
    cur = cur.next

    if (l1 === null && l2 === null && carry !== 0) {
      cur.next = new ListNode()
      cur.next.val = carry
    }
  }

  return head.next
}
// @lc code=end
