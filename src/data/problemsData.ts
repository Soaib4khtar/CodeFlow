import { PracticeProblem, TopicData } from '../types/codeflow';
import { dsaTopicsPart1 } from './dsaTopicsPart1';
import { dsaTopicsPart2 } from './dsaTopicsPart2';
import { pillarsTopics } from './pillarsTopics';

export const ALL_CODEFLOW_TOPICS: TopicData[] = [
  ...dsaTopicsPart1,
  ...dsaTopicsPart2,
  ...pillarsTopics
];

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'prob-two-sum',
    number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    topicId: 'hash-tables',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    example1: {
      input: 'nums = [2, 11, 7, 15], target = 9',
      output: '[0, 2]'
    },
    example2: {
      input: 'nums = [3, 2, 4], target = 6',
      output: '[1, 2]'
    },
    functionName: 'twoSum',
    starterCode: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    solutionCode: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { label: 'Example 1: nums = [2, 11, 7, 15], target = 9', args: [[2, 11, 7, 15], 9], expected: [0, 2] },
      { label: 'Example 2: nums = [3, 2, 4], target = 6', args: [[3, 2, 4], 6], expected: [1, 2] },
      { label: 'Edge Case: Duplicate values [3, 3], target = 6', args: [[3, 3], 6], expected: [0, 1] }
    ]
  },
  {
    id: 'prob-binary-search',
    number: 2,
    title: 'Binary Search',
    difficulty: 'Medium',
    topicId: 'binary-search',
    description:
      'Given a sorted array of integers and a target value, return the index of the target if it exists. If the target is not found, return -1.',
    example1: {
      input: 'nums = [1, 3, 5, 7, 9], target = 7',
      output: '3'
    },
    example2: {
      input: 'nums = [1, 3, 5, 7, 9], target = 2',
      output: '-1'
    },
    functionName: 'binarySearch',
    starterCode: `function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    solutionCode: `function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    testCases: [
      { label: 'Example 1: nums = [1, 3, 5, 7, 9], target = 7', args: [[1, 3, 5, 7, 9], 7], expected: 3 },
      { label: 'Example 2: nums = [1, 3, 5, 7, 9], target = 2', args: [[1, 3, 5, 7, 9], 2], expected: -1 },
      { label: 'Boundary Case: First element target = 1', args: [[1, 3, 5, 7, 9], 1], expected: 0 }
    ]
  },
  {
    id: 'prob-merge-k-sorted-lists',
    number: 3,
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    topicId: 'heaps',
    description:
      'You are given an array of k sorted arrays/lists. Merge all the sorted lists into one single sorted array and return it.',
    example1: {
      input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
      output: '[1, 1, 2, 3, 4, 4, 5, 6]'
    },
    example2: {
      input: 'lists = []',
      output: '[]'
    },
    functionName: 'mergeKLists',
    starterCode: `function mergeKLists(lists) {
  const flat = [];
  for (const list of lists) {
    for (const val of list) flat.push(val);
  }
  return flat.sort((a, b) => a - b);
}`,
    solutionCode: `function mergeKLists(lists) {
  return lists.flat().sort((a, b) => a - b);
}`,
    testCases: [
      {
        label: 'Example 1: [[1,4,5],[1,3,4],[2,6]]',
        args: [[[1, 4, 5], [1, 3, 4], [2, 6]]],
        expected: [1, 1, 2, 3, 4, 4, 5, 6]
      },
      { label: 'Example 2: Empty lists []', args: [[]], expected: [] },
      { label: 'Negative numbers [[-2, 5], [-3, 0]]', args: [[[-2, 5], [-3, 0]]], expected: [-3, -2, 0, 5] }
    ]
  },
  {
    id: 'prob-longest-substring',
    number: 4,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topicId: 'sliding-window',
    description:
      'Given a string s, find the length of the longest substring without duplicate characters using a dynamic Sliding Window [left, right].',
    example1: {
      input: 's = "abcabcbb"',
      output: '3 ("abc")'
    },
    example2: {
      input: 's = "bbbbb"',
      output: '1 ("b")'
    },
    functionName: 'lengthOfLongestSubstring',
    starterCode: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    solutionCode: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) seen.delete(s[left++]);
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    testCases: [
      { label: 'Example 1: s = "abcabcbb"', args: ['abcabcbb'], expected: 3 },
      { label: 'Example 2: s = "bbbbb"', args: ['bbbbb'], expected: 1 },
      { label: 'Example 3: s = "pwwkew"', args: ['pwwkew'], expected: 3 }
    ]
  },
  {
    id: 'prob-reverse-linked-list',
    number: 5,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topicId: 'linked-lists',
    description:
      'Given the elements of a singly linked list, reverse the nodes in-place and return the reversed sequence.',
    example1: {
      input: 'head = [10, 20, 30]',
      output: '[30, 20, 10]'
    },
    example2: {
      input: 'head = [1, 2]',
      output: '[2, 1]'
    },
    functionName: 'reverseListArray',
    starterCode: `function reverseListArray(arr) {
  let left = 0, right = arr.length - 1;
  const copy = [...arr];
  while (left < right) {
    [copy[left], copy[right]] = [copy[right], copy[left]];
    left++;
    right--;
  }
  return copy;
}`,
    solutionCode: `function reverseListArray(arr) {
  return [...arr].reverse();
}`,
    testCases: [
      { label: 'Example 1: [10, 20, 30]', args: [[10, 20, 30]], expected: [30, 20, 10] },
      { label: 'Example 2: [1, 2]', args: [[1, 2]], expected: [2, 1] },
      { label: 'Empty List []', args: [[]], expected: [] }
    ]
  },
  {
    id: 'prob-valid-parentheses',
    number: 6,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topicId: 'stacks-queues',
    description:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid using a LIFO Stack.',
    example1: {
      input: 's = "{[()]}"',
      output: 'true'
    },
    example2: {
      input: 's = "(]"',
      output: 'false'
    },
    functionName: 'isValid',
    starterCode: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
    solutionCode: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else stack.push(ch);
  }
  return stack.length === 0;
}`,
    testCases: [
      { label: 'Example 1: s = "{[()]}"', args: ['{[()]}'], expected: true },
      { label: 'Example 2: s = "(]"', args: ['(]'], expected: false },
      { label: 'Unclosed opening bracket "("', args: ['('], expected: false }
    ]
  },
  {
    id: 'prob-course-schedule',
    number: 7,
    title: 'Course Schedule (Topological Sort)',
    difficulty: 'Medium',
    topicId: 'topological-sorting',
    description:
      "There are numCourses courses labeled 0 to numCourses - 1. Given prerequisites pairs [course, prereq], return true if all courses can be finished (no cycle).",
    example1: {
      input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
      output: 'true'
    },
    example2: {
      input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
      output: 'false (Cycle detected)'
    },
    functionName: 'canFinish',
    starterCode: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    indegree[course]++;
  }
  const queue = [];
  indegree.forEach((d, i) => { if (d === 0) queue.push(i); });
  let count = 0;
  while (queue.length > 0) {
    const u = queue.shift();
    count++;
    for (const v of adj[u]) {
      if (--indegree[v] === 0) queue.push(v);
    }
  }
  return count === numCourses;
}`,
    solutionCode: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [c, p] of prerequisites) { adj[p].push(c); indegree[c]++; }
  const q = indegree.map((d, i) => d === 0 ? i : -1).filter(i => i !== -1);
  let cnt = 0;
  while (q.length) {
    const u = q.shift(); cnt++;
    for (const v of adj[u]) if (--indegree[v] === 0) q.push(v);
  }
  return cnt === numCourses;
}`,
    testCases: [
      { label: 'Example 1: Valid DAG (4 courses)', args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true },
      { label: 'Example 2: Circular dependency [[1,0],[0,1]]', args: [2, [[1, 0], [0, 1]]], expected: false }
    ]
  },
  {
    id: 'prob-merge-intervals',
    number: 8,
    title: 'Merge Overlapping Intervals',
    difficulty: 'Medium',
    topicId: 'interval-problems',
    description:
      'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals.',
    example1: {
      input: 'intervals = [[1,4],[2,6],[8,10]]',
      output: '[[1,6],[8,10]]'
    },
    example2: {
      input: 'intervals = [[1,4],[4,5]]',
      output: '[[1,5]]'
    },
    functionName: 'mergeIntervals',
    starterCode: `function mergeIntervals(intervals) {
  const sorted = intervals.map(x => [...x]).sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    if (sorted[i][0] <= prev[1]) {
      prev[1] = Math.max(prev[1], sorted[i][1]);
    } else {
      merged.push(sorted[i]);
    }
  }
  return merged;
}`,
    solutionCode: `function mergeIntervals(intervals) {
  const sorted = intervals.map(x => [...x]).sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    if (sorted[i][0] <= prev[1]) prev[1] = Math.max(prev[1], sorted[i][1]);
    else merged.push(sorted[i]);
  }
  return merged;
}`,
    testCases: [
      { label: 'Example 1: [[1,4],[2,6],[8,10]]', args: [[[1, 4], [2, 6], [8, 10]]], expected: [[1, 6], [8, 10]] },
      { label: 'Example 2: Touching boundary [[1,4],[4,5]]', args: [[[1, 4], [4, 5]]], expected: [[1, 5]] }
    ]
  }
];
