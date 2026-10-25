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
    }
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
    }
  },
  {
    id: 'prob-merge-k-sorted-lists',
    number: 3,
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    topicId: 'heaps',
    description:
      'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list using a Min-Heap Priority Queue and return it.',
    example1: {
      input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
      output: '[1, 1, 2, 3, 4, 4, 5, 6]'
    },
    example2: {
      input: 'lists = []',
      output: '[]'
    }
  },
  {
    id: 'prob-longest-substring',
    number: 4,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topicId: 'sliding-window',
    description:
      'Given a string s, find the length of the longest substring without duplicate characters using a dynamic Sliding Window [left, right] and a Set/Map.',
    example1: {
      input: 's = "abcabcbb"',
      output: '3 ("abc")'
    },
    example2: {
      input: 's = "bbbbb"',
      output: '1 ("b")'
    }
  },
  {
    id: 'prob-reverse-linked-list',
    number: 5,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topicId: 'linked-lists',
    description:
      'Given the head of a singly linked list, reverse the list in-place using three pointers (prev, curr, nextTemp) and return the reversed head.',
    example1: {
      input: 'head = [10, 20, 30]',
      output: '[30, 20, 10]'
    },
    example2: {
      input: 'head = [1, 2]',
      output: '[2, 1]'
    }
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
    }
  },
  {
    id: 'prob-course-schedule',
    number: 7,
    title: 'Course Schedule (Topological Sort)',
    difficulty: 'Medium',
    topicId: 'topological-sorting',
    description:
      "There are a total of numCourses courses you have to take. Given prerequisites pairs, determine if you can finish all courses using Kahn's Indegree BFS algorithm.",
    example1: {
      input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
      output: '[0, 1, 2, 3]'
    },
    example2: {
      input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
      output: 'false (Cycle detected)'
    }
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
    }
  }
];
