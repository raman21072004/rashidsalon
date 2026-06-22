import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings" as never)
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Record<string, unknown> | null;
    },
  });

export const useServices = (featuredOnly = false) =>
  useQuery({
    queryKey: ["services", { featuredOnly }],
    queryFn: async () => {
      let q = supabase
        .from("services" as never)
        .select("*")
        .order("sort_order");
      if (featuredOnly) q = q.eq("featured", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

export const useService = (slug: string) =>
  useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services" as never)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Record<string, unknown> | null;
    },
  });

export const useStylists = () =>
  useQuery({
    queryKey: ["stylists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stylists" as never)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

export const useStylist = (id: string) =>
  useQuery({
    queryKey: ["stylist", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stylists" as never)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Record<string, unknown> | null;
    },
  });

export const useCourses = (featuredOnly = false) =>
  useQuery({
    queryKey: ["courses", { featuredOnly }],
    queryFn: async () => {
      let q = supabase
        .from("courses" as never)
        .select("*")
        .order("sort_order");
      if (featuredOnly) q = q.eq("featured", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

export const useCourse = (slug: string) =>
  useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses" as never)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Record<string, unknown> | null;
    },
  });

export const useGallery = () =>
  useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery" as never)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

export const useReviews = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });
