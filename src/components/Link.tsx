"use client";

import React from "react";

import { LinkProps as NextLinkProps } from "next/link";

import styled from "styled-components";
import { UrlObject } from "url";

import { Locale } from "@/config";
import { Link as IntlLink, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Styled anchor fallback
const Anchor = styled("a")({});

// NextLinkComposed base props
interface NextLinkComposedProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
        Omit<
            NextLinkProps,
            "href" | "as" | "onClick" | "onMouseEnter" | "onTouchStart" | "prefetch"
        > {
    to: any;
    linkAs?: NextLinkProps["as"];
    locale?: Locale;
    prefetch?: boolean;
}

// Composed internal i18n link
export const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
    function NextLinkComposed(props, ref) {
        const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...other } = props;

        return (
            <IntlLink
                href={to}
                as={linkAs}
                replace={replace}
                scroll={scroll}
                shallow={shallow}
                prefetch={prefetch}
                passHref
                locale={locale}
                ref={ref}
                {...other}
            />
        );
    },
);

// ---- FINAL LinkProps ----

type BaseProps = {
    href: string | UrlObject | undefined;
    as?: NextLinkProps["as"];
    linkAs?: NextLinkProps["as"];
    locale?: Locale;
    prefetch?: boolean;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    activeClassName?: string;
    disabled?: boolean;
    className?: string;
    withoutStyling?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type StaticChildren = {
    children: React.ReactNode;
    render?: never;
};

type RenderChildren = {
    children?: never;
    render: (props: { isActive: boolean }) => React.ReactNode;
};

export type LinkProps = BaseProps & (StaticChildren | RenderChildren);

// ---- Main Link Component ----

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
    const {
        href,
        as,
        linkAs: linkAsProp,
        locale,
        prefetch,
        replace,
        scroll,
        shallow,
        activeClassName = "active",
        disabled = false,
        className: classNameProp,
        children,
        render,
        withoutStyling = true,
        ...rest
    } = props;

    const pathname = usePathname();

    const isActive = checkLinkIsActive(href, pathname);

    const className = cn(
        "outline-none focus:outline-none cursor-pointer",
        classNameProp,
        withoutStyling
            ? ""
            : "transition-all duration-300 underline-offset-4 hover:text-primary hover:underline",
        isActive && activeClassName,
        disabled && "disabled",
    );

    const isExternal =
        typeof href === "string" && (href.startsWith("http") || href.startsWith("mailto:"));

    const childContent = render ? render({ isActive }) : children;

    const linkAs = linkAsProp || as;

    if (isExternal) {
        return (
            <Anchor
                href={href}
                ref={ref}
                className={className}
                aria-disabled={disabled}
                aria-label="Link"
                tabIndex={disabled ? -1 : undefined}
                onClick={disabled ? (e: any) => e.preventDefault() : undefined}
                {...rest}
            >
                {childContent}
            </Anchor>
        );
    }

    return (
        <NextLinkComposed
            ref={ref}
            to={!disabled && !isExternal ? href : undefined}
            linkAs={linkAs}
            locale={locale}
            prefetch={prefetch}
            replace={replace}
            scroll={scroll}
            shallow={shallow}
            className={className}
            aria-disabled={disabled}
            aria-label="Link"
            tabIndex={disabled ? -1 : undefined}
            onClick={disabled ? (e: any) => e.preventDefault() : undefined}
            {...rest}
        >
            {childContent}
        </NextLinkComposed>
    );
});

export function checkLinkIsActive(href: string | UrlObject | undefined, pathname: string) {
    const normalizePath = (path: string | null | undefined) => path?.replace(/\/$/, "") ?? "";

    const current = normalizePath(pathname);
    const target = typeof href === "string" ? normalizePath(href) : normalizePath(href?.pathname);
    return current === target;
}

export default Link;
