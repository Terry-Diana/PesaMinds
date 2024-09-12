import React from "react";
import ArticleComponent from "./Articles";

const sampleArticles = [
  {
    id: 1,
    title: "Understanding Financial Literacy",
    summary:
      "Finance Literacy levels among Kenyans are alarmingly low. A 2021 Global Financial Literacy Survey found that financial Literacy level were low in Africa with Kenya recording 30%.",
    link: "https://www.businessdailyafrica.com/bd/lifestyle/personal-finance/how-to-grow-your-financial-literacy-skills-to-become--4088348",
    image:
      "https://img.freepik.com/free-vector/illustration-financial-concept_53876-20606.jpg?t=st=1726147369~exp=1726150969~hmac=834448156f48c8d1a4a35078860812de3b4a6977013141d90edb00c48e609a56&w=1380",
  },
  {
    id: 2,
    title: "Simple Guide To Budgeting Like A Pro",
    summary:
      "A budget is a guideline of how to spend income. While many people don’t see the need for a personal budget, this is one of the core foundations of good financial health. Proper budgeting stipulates how one will use their money within a given period of time.",
    link: "https://www.kenyanvibe.com/simple-guide-to-budgeting-like-a-pro/",
    image:
      "https://img.freepik.com/free-vector/financial-diversification-growth-concept-with-income-symbols-flat-vector-illustration_1284-78164.jpg?t=st=1726146398~exp=1726149998~hmac=7585fad4537b2be9b8cb735fdf33def2d66ee92fdae0ce0cfa97ce3a12176eac&w=1380", // Replace with actual image link
  },
  {
    id: 3,
    title: "Types of Insurance",
    summary: "There are three broad types of Life Insurance Covers:",
    link: "https://www.understandinsurance.co.ke/buying-insurance/types-of-insurance/",
    image:
      "https://img.freepik.com/free-vector/family-benefit-abstract-concept-vector-illustration-family-tax-benefit-payment-per-child-help-with-raising-children-economic-support-insurance-agent-piggy-bank-money-abstract-metaphor_335657-3984.jpg?t=st=1726146901~exp=1726150501~hmac=1864ac15243d4ff22ef6dd8812e62400c81074856a2d8c3788e4c6fdd8fc2bd2&w=826", // Replace with actual image link
  },
];

const ArticlesData: React.FC = () => {
  return (
    <div className="articles-page">
      <ArticleComponent articles={sampleArticles} />
    </div>
  );
};

export default ArticlesData;
