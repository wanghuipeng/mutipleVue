import Vue from 'vue'
import filter from '@/utils/filters'

Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))
