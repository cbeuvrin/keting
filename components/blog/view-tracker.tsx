"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ViewTrackerProps {
  articleId: number | string;
}

export function ViewTracker({ articleId }: ViewTrackerProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;
    hasIncremented.current = true;

    const incrementViews = async () => {
      // First, try using an RPC (atomic and reliable)
      const { error: rpcError } = await supabase.rpc("increment_views", {
        article_id: articleId,
      });

      if (rpcError) {
        console.warn("RPC increment_views failed, falling back to manual update:", rpcError.message);
        
        // Fallback: Manual retrieval and update (non-atomic, but works if RPC isn't set up)
        const { data } = await supabase
          .from("articles")
          .select("views")
          .eq("id", articleId)
          .single();

        if (data) {
          const currentViews = data.views || 0;
          await supabase
            .from("articles")
            .update({ views: currentViews + 1 })
            .eq("id", articleId);
        }
      }
    };

    // Small delay to avoid counting bounces or accidental refreshes immediately
    const timer = setTimeout(() => {
        incrementViews();
    }, 2000);

    return () => clearTimeout(timer);
  }, [articleId]);

  return null;
}
