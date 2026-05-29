"use client";

import { motion } from "framer-motion";
import Section from "./ui/Section";

export default function Editorial() {
  return (
    <Section
      id="problem"
      index="01"
      kicker="为什么你会被带偏"
      kickerEn="The problem"
      className="py-20 md:py-28"
    >
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="dropcap font-sc text-[1.12rem] leading-[1.9] text-ink">
            在信息过载、自媒体、营销话术与评论区彼此交织的今天,一段话能不能让你信以为真,
            早已不是碰运气,而是被设计出来的:挑过的措辞、似是而非的逻辑、踩准情绪的节奏。
            被带偏,往往不是因为你不够聪明,而是因为说服与误导本身,就是一门被反复打磨的手艺。
          </p>
          <p className="font-sc mt-6 text-[1.12rem] leading-[1.9] text-ink-soft">
            而破解之道其实很朴素:把这些被设计过的机制
            <span className="font-semibold text-ink">看见</span>,
            人才拿得回判断的主动权。我们想做一件事——把那些藏在文字里的「钩子」摊到台面上,
            让独立思考与客观判断重新回到每个普通人手边。
          </p>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative flex flex-col justify-center border-l-2 border-fallacy pl-6"
        >
          <span className="font-display absolute -left-1 -top-6 text-6xl leading-none text-rule">
            &ldquo;
          </span>
          <p className="font-display text-2xl italic leading-snug text-ink md:text-[1.7rem]">
            对抗被精心设计的东西,光靠「你再聪明一点」是最先失败的那条路。
          </p>
          <p className="font-sc mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
            真正有用的,是把机制摊开、让它可见、可追问。这正是明辨想交回到每个人手里的能力。
          </p>
          <span className="label-mono mt-5 text-ink-faint">
            — What we learned
          </span>
        </motion.blockquote>
      </div>
    </Section>
  );
}
