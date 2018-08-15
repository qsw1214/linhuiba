import Vue from 'vue'
import { toWeeks } from'@/filters'

describe('pure func', () => {
  it('should be chinese week name', () => {
    let week = '周一'
    expect(toWeeks(week)).toBe('星期一')
  })
}) 


